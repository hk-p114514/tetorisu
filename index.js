'use strict';
    // ミノを構成する一つのブロックのサイズ
    const blockSize = 30;

    // テトロミノのサイズ
    const tetroSize = 4;

     // 画面の準備 ----------------------------------------------------------------

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const fieldCol = 10;
    const fieldRow = 20;

    canvas.width = blockSize * fieldCol;
    canvas.height = blockSize * fieldRow;

    const control = document.getElementById('control');

    const controllerWidth = canvas.width + (canvas.width / 2);
    control.style.width = controllerWidth + 'px';
    control.style.margin = '5% auto';
    const left = document.getElementById('left');
    const right = document.getElementById('right');
    const rotateLeft = document.getElementById('rotate-left');
    const rotateRight = document.getElementById('rotate-right');

    const body = document.querySelector('body');
    canvas.style.marginLeft = (body.clientWidth / 2) - (canvas.width / 2) + 'px';

    // 次のミノの表示画面
    const next = document.getElementById('next');
    const ntx = next.getContext('2d');

    next.width = blockSize * 4;
    next.height = blockSize * 4;

    const score = document.getElementById('score');

    // フィールドの色関連
    const fieldColor = 'rgb(206, 230, 163)';
    canvas.style.backgroundColor = fieldColor;
    canvas.style.outline = "4px solid #555";

    const tetroColors = [
        fieldColor,
        'green',
        'yellow',
        'rgb(116, 143, 231)',//blue,
        'skyblue',
        'gray', 
        'orange', 
        'pink'
    ];


    // フィールドの宣言
    let field = [];    

    // ゲームオーバーフラグ
    let gameOver = false;

    
    // テトロミノの宣言
    const tetroTypes = [
        [], //0, 空っぽ -> 着地点用
        [//1, I
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [//2, L
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ],
        [//3, J
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ],
        [//4, T
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0],
        ],
        [//5, O
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ],
        [//6, Z
            [0, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ],
        [//7, S
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0],
        ],
    ];
    const tetroTypesObject = {
        1 : 'I',
        2 : 'L',
        3 : 'J',
        4 : 'T',
        5 : 'O',
        6 : 'Z',
        7 : 'S',
    }
    // テトロミノの初期地点　ー＞　画面中央の上から出現する
    const startX = fieldCol / 2 - tetroSize / 2;
    const startY = 0;

    // テトロミノの座標
    let tetroX = startX;
    let tetroY = startY;

    // テトロミノの落ちるスピード -> dropSpeed (ミリ秒)に１ブロック分落ちる (1000ミリ秒で1秒)
    const dropSpeed = 800;

    // キーボード操作
    document.onkeydown = (e) => {
        gameController(e);
    }

    // ボタン操作
    // right.addEventListener('onclick', () => {
    //     gameController(39);
    //     console.log('button pushed');
    // });

    // left.addEventListener('onclick', () => {
    //     gameController(37);
    //     console.log('button pushed');
    // });

    // rotateRight.addEventListener('onclick', () => {
    //     rotate(1);
    //     console.log('button pushed');
    // });

    // rotateLeft.addEventListener('onclick', () => {
    //     rotate(0);
    //     console.log('button pushed');
    // });

    right.onclick = () => {
        console.log('button pushed');
        gameController(39);
    };

    left.onclick = () => {
        gameController(37);
    };

    rotateRight.onclick = () => {
        gameController(70);
    };

    rotateLeft.onclick = () => {
        gameController(68);
    };


    const gameController = (e) => {
        if(gameOver) return ;
        let nteto;
        switch(e) {
            case 37:
                // 左
               if(checkMove(-1, 0)) tetroX--;
                break;
            case 38:
                // 上キーを押すと、一気に下に行く
               while(checkMove(0, 1)) tetroY += 1;
                break;
            case 39:
                // 右
               if(checkMove(1, 0)) tetroX++;
                break;
            case 40:
                // 下
               if(checkMove(0, 1)) tetroY++;
                break;
            case 70:
                // Fキー
                nteto = rotate(0);
                if(checkMove(0, 0, nteto))tetro = nteto;
                break;
            case 68:
                nteto = rotate(1);
                if(checkMove(0, 0, nteto))tetro = nteto;
                break;
            case 32:
                // スペース
                break;
            
        }
        drawAll();
    }

    

    // ntx.fillRect(0, 0, blockSize, blockSize);
    // ゲームの実行処理 
    let Ttype = getRandomNum(1, tetroTypes.length - 1);
    let newTtype = getRandomNum(1, tetroTypes.length - 1);

    // console.log("now : " + Ttype + " new : " + newTtype);

    let newTetro = tetroTypes[newTtype];
    let tetro = tetroTypes[Ttype];

    init();
    drawAll();
    drawNext();
    setInterval(dropBlock, dropSpeed);