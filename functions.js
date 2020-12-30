'use strict';

const getRandomNum = (min,max)=> {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// 初期化の関数
    const init = () => {
        for(let y = 0; y < fieldRow; y++) {
            field[y] = [];
            for(let x = 0; x < fieldCol; x++) {
                field[y][x] = 0;
            }
        }
    }


 // ブロック一つを描画する
    const drawBlock = (x, y, c) => {
        let px = x * blockSize;
        let py = y * blockSize;
        ctx.fillStyle = tetroColors[c];
        ctx.fillRect(px, py, blockSize, blockSize);
        ctx.strokeStyle = 'black';
        if(c == 0) {
            ctx.setLineDash([2, 2]);
        } else {
            ctx.setLineDash([0, 0]);
        } 
        ctx.strokeRect(px, py, blockSize, blockSize);
    }   

     //ブロックの当たり判定
    const checkMove = (mx, my, ntetro) => {
        if(ntetro == undefined) ntetro = tetro;

        for(let y = 0; y < tetroSize; y++) {
            for(let x = 0; x < tetroSize; x++) {
                if(ntetro[y][x]) 
                {
                    let nx = tetroX + mx + x;
                    let ny = tetroY + my + y;

                    if( ny < 0 ||
                        nx < 0 ||
                        ny >= fieldRow ||
                        nx >= fieldCol ||
                        field[ny][nx]
                    ) return false;
                }
            }
        }
        return true;
    }   

    const drawAll = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // フィールドの描画
        for(let y = 0; y < fieldRow; y++) {
            for(let x = 0; x < fieldCol; x++) {
                if(field[y][x]) {
                    drawBlock(x, y, field[y][x]);
                }
            }
        }

        // テトロミノの描画

        //  下にいくつ行けるかを調べる
        let under = 0;
        while(checkMove(0, under + 1)) under++;

        for(let y = 0; y < tetroSize; y++) {
            for(let x = 0; x < tetroSize; x++) {
                if(tetro[y][x]) {
                    // 着地点
                    drawBlock(tetroX + x, tetroY + y + under, 0);
                    // テトロミノ本体
                    drawBlock(tetroX + x, tetroY + y, Ttype);
                }
            }
        }

        if(gameOver) {
            ctx.font = 'bold 250% verdana';
            let overMessage = "GAME OVER";
            let w = ctx.measureText(overMessage).width;
            let x = canvas.width / 2 - w / 2;
            let y = canvas.height / 2 - w / 20;
            ctx.fillStyle = 'white';
            ctx.lineWidth = 4;
            ctx.strokeText(overMessage, x, y);
            ctx.fillText(overMessage, x, y);
        }
   }   

    const fixTetro = () => {
       for(let y = 0; y < tetroSize; y++) {
           for(let x = 0; x < tetroSize; x++) {
               if(tetro[y][x]) {
                   field[tetroY + y][tetroX + x] = Ttype;
               }
           }
       }
   }

   const checkLine = () => {
       let lineCount = 0;
       for(let y = 0; y < fieldRow; y++) {
           let flag = true;
           for(let x = 0; x < fieldCol; x++) {
               if(!field[y][x]) {
                   flag = false;
                   break;
               }
           }
           if(flag) {
               lineCount++;

               for(let ny = y; ny > 0; ny--) {
                   for(let nx = 0; nx < fieldCol; nx++) {
                       field[ny][nx] = field[ny - 1][nx];
                   }
               }
           }
       }
   }

//    テトロミノが落ちる処理
   const dropBlock = () => {
       if(gameOver) return;
       if(checkMove(0, 1)) {
            tetroY++;
       } else {
           fixTetro();
           checkLine();

           Ttype = getRandomNum(1, tetroTypes.length - 1);
           tetro = tetroTypes[Ttype];
           tetroX = startX;
           tetroY = startY;

           if(! checkMove(0, 0)) {
               gameOver = true;
           }
       }
       drawAll();
   }  

       // テトロミノの回転
    const rotate = (rotateType) => {
        let newTet = [];
        for(let y = 0; y < tetroSize; y++) {
            newTet[y] = [];
            for(let x = 0; x < tetroSize; x++) {
                let nx;
                let ny;
                if(!rotateType) {
                    nx = tetroSize - x - 1;
                    ny = y;
                } else {
                    // nx = tetroSize - y - 1;
                    // ny = tetroSize - x - 1
                    nx = x;
                    ny = tetroSize - y - 1;
                }
                newTet[y][x] = tetro[nx][ny];
            }
        }
        return newTet;
    }