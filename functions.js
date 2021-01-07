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

    const addScore = (lineCount) => {
        console.log(`lineCount is ${lineCount}`);
        let add = (lineCount + Math.floor(lineCount / 2)) * 100;
        console.log(add);
        score += add;
        scoreView.innerText = `SCORE : ${score} P`;
    }

 // ブロック一つを描画する
    const drawBlock = (x, y, c, where) => {
        let px = x * blockSize;
        let py = y * blockSize;

        where.fillStyle = tetroColors[c];
        where.fillRect(px, py, blockSize, blockSize);
        where.strokeStyle = 'black';

        if(c == 0) {
            // 着地点
            ctx.setLineDash([2, 2]);
        } else {
            // 本体
            where.setLineDash([0, 0]);
        } 

        where.strokeRect(px, py, blockSize, blockSize);
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

        // フィールドのクリア　ー＞　現在の描画を一旦消す
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // フィールドの描画
        for(let y = 0; y < fieldRow; y++) {
            for(let x = 0; x < fieldCol; x++) {
                if(field[y][x]) {
                    drawBlock(x, y, field[y][x], ctx);
                }
            }
        }

        // テトロミノの描画 ----------------------------------------------------------------

        //  下にいくつ行けるかを調べる
        let under = 0;
        while(checkMove(0, under + 1)) under++;

        for(let y = 0; y < tetroSize; y++) {

            for(let x = 0; x < tetroSize; x++) {

                if(tetro[y][x]) {

                    // 着地点
                    drawBlock(tetroX + x, tetroY + y + under, 0, ctx/* 0を指定すればテトロミノの0番目の空白のミノを指定できる */);

                    // テトロミノ本体
                    drawBlock(tetroX + x, tetroY + y, Ttype, ctx);
                    
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
                //   フィールドに現在のタイプ（Ttype）のミノを固定する 
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
                addScore(lineCount);
           }
       }
   }

   const drawNext = () => {
       for(let y = 0; y < tetroSize; y++) {
           for(let x = 0; x < tetroSize; x++) {
               if(newTetro[y][x]) {
                   drawBlock(x, y, newTtype, ntx);
               }
           }
       }
   }

//    テトロミノが落ちる処理
   const dropBlock = () => {
    //    ゲームオーバーだったら、その時点で処理をしない
       if(gameOver) return;

       if(checkMove(0, 1)/* 現在地の一つ下に行けるか（落ちれるか）を調べる */) {
            tetroY++; // 一つ下にミノを落とす
       } else {
        //もう下に行けない　ー＞　一番下もしくはミノの上
        toggleHold = true;
           fixTetro(); //フィールドに現在のミノを同化させる
           checkLine();//一行消せるかどうかを確認する
        //    新しいミノを作る　********************************
        createTetro();

        //    console.log("now : " + Ttype + " new : " + newTtype);
        //    新しいミノが現在地で動けるかどうか　ー＞　動けない　＝　ミノまたは壁に接触している　＝　ゲームオーバー
           if(! checkMove(0, 0)) {
               gameOver = true;
           }
       }
       //また描画リセット＆着地点等の処理を呼ぶ
       drawAll();
       drawNext();
   }  

        const createTetro = () => {
                Ttype = newTtype;
                newTtype = getRandomNum(1, tetroTypes.length - 1);

                tetro = tetroTypes[Ttype];
                ntx.clearRect(0, 0, next.width, next.height);
                newTetro = tetroTypes[newTtype];

                tetroX = startX;
                tetroY = startY;
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

    const tetroHold = () => {
      if(toggleHold){
        toggleHold = false;
       if(!hold) {
            hold = true;
            holdType = Ttype;
            holdTetro = tetroTypes[holdType];
            createTetro();
        } else {
            let beforeHold = Ttype;
            Ttype = holdType;
            holdType = beforeHold;
            tetro = tetroTypes[Ttype];
            holdTetro = tetroTypes[holdType];
            tetroX = startX;
            tetroY = startY;
        }
        htx.clearRect(0, 0,holdView.width, holdView.height);
        for(let x = 0; x < tetroSize; x++) {
            for(let y = 0; y < tetroSize; y++) {
                if(holdTetro[y][x])drawBlock(x, y, holdType, htx);
            }
        }
      }
    }
