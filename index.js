'use strict';
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

    const body = document.querySelector('body');
    canvas.style.marginLeft = (body.clientWidth / 2) - (canvas.width / 2) + 'px';

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
        [], //0, 空っぽ
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
    const startX = fieldCol / 2 - tetroSize / 2;
    const startY = 0;
    // テトロミノの座標
    let tetroX = startX;
    let tetroY = startY;

    // テトロミノの落ちるスピード
    const dropSpeed = 800;

    // テトロミノの準備 ----------------------------------------------------------------

    let Ttype = getRandomNum(1, tetroTypes.length - 1);
    let tetro = tetroTypes[Ttype];
    init();
    drawAll();
    setInterval(dropBlock, dropSpeed);

    


    // キーボード操作
    document.onkeydown = (e) => {
        if(gameOver) return ;
        let nteto;
        switch(e.keyCode) {
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