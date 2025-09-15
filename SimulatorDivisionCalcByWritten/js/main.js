'use strict'
{
    const wrapper = document.getElementById("wrapper");
    const displayCells = [[], [], [], [], [], [], [], [], [], [], []];  //筆算表示用セル
    const allCells = [[], [], [], [], [], [], [], [], [], []];          //全セル用
    const straightLines = [];   //直線配列
    const buttons_10key = [];   //10key配列
    let isCalc0 = true;         //0の計算をするかどうか
    let isHighlight = true;     //ハイライトするかどうか
    let step = 0;               //現在のstep数
    let currentDigit = 0;       //商表示用列番号（現在商をたてている位）
    let currentDividendRow = 2; //現在計算している行（displayCells用）
    let currentProductRow = 2;  //積表示用行番号(allCells用)
    let currentLine = 1;        //表示ライン用
    let dividendNum = 9999;     //わられる数
    let divisorNum = 999;       //わる数
    let dividendNumNow = 9;     //現在のわられる数
    let inputQuotient;          //次に入力する商のセル
    let isValid10keysX = true;  //商に×を指定できるか
    const stepActions = [
        () => { //step:0 わられる数表示
            isValid10keysX = true;
            isValid10keys(false);
            changeMode10keys("Calc");
            input1.readOnly = true;
            input2.readOnly = true;
            isValidButton(btnCalc0, false);
            isValidButton(btnIsHighlight, false);
            isValidButton(btnRandom, false);
            SetDividendNumDivisorNum();
            SetLineLength();
            showDividendNumber();
            document.getElementById("btnNext").textContent = "次へ";
            text_bottom.textContent = "まず、わられる数を書いて…";
        },
        () => { //step:1 曲線表示
            isVisible(curveLine, true);
            text_bottom.textContent = "左に曲線を書きます。";
        },
        () => { //step:2 わる数表示
            showDivisorNumber();
            text_bottom.textContent = "次に、わる数を書いて…";
        },
        () => { //step:3 直線表示
            currentLine = 1;
            isVisible(straightLines[currentLine - 1], true);
            text_bottom.textContent = "わられる数の上に直線を引きます。";
        },
        () => { //step:4 商をたてる
            highlightQuotient();
            highlightNowDivision(true);
            inputQuotient = displayCells[1][currentDigit];
            getDividendNumNow();
            if (currentDigit === String(dividendNum).length - 1) { isValid10keysX = false; }
            isValid10keys(true);
            isInputQuotient();
            btnNext.textContent = "次へ";
            const whareDigit = [["一番左", "最後"], ["一番左", "左から２番目", "最後"], ["一番左", "左から２番目", "左から３番目", "最後"]];
            let estimateText = "";
            if (String(divisorNum).length >= 2 && String(dividendNumNow).length >= String(divisorNum).length) {
                const minus = Math.min(String(dividendNumNow).length, String(divisorNum).length) - 1;
                const newDividendNum = String(dividendNumNow).slice(0, -1 * minus);
                const newDivisorNum = String(divisorNum).slice(0, -1 * minus);
                estimateText = `${newDividendNum}÷${newDivisorNum}で考えると、考えやすいです。`;
            }
            let whenQuotientNone = "×";
            if (isValid10keysX === false) { whenQuotientNone = "0"; }
            text_bottom.textContent = `${whareDigit[String(dividendNum).length - 2][currentDigit]}の位に、商をたてます。${dividendNumNow}÷${String(divisorNum)}です。${estimateText}\nつかわない位を手でかくすのもいいですね。\n商がたたないとき　→　${whenQuotientNone}を入力\n入力したら「次へ」をおしましょう。`;
        },
        () => { //step:5 積の表示
            isValid10keys(false);
            if (inputQuotient.textContent === "×") {
                text_bottom.textContent = "商がたたないときは、かけ算をしません。";
            } else if (inputQuotient.textContent === "0") {
                if (isCalc0) {
                    highlightNowMultiplication();
                    showProduct();
                } else {
                    text_bottom.textContent = "商が0のときは、かけ算をしょうりゃくできます。";
                }
            }
            else {
                highlightNowMultiplication();
                showProduct();
            }
        },
        () => { //step:6 商の検証
            highlightOFF(false);
            judgeQuotient();
        },
        () => { //step:7 おろすor商のたて直し
            judgeBringDownOrRedivide();
        },
        () => { //step:8 次の計算へ
            goNextDivide();
        }
    ];

    // 左
    const left = document.createElement("div");
    left.id = "left";

    // 右
    const right = document.createElement("div");
    right.id = "right";

    wrapper.appendChild(left);
    wrapper.appendChild(right);

    // title
    const title = document.createElement("div");
    title.id = "title";
    title.textContent = "わり算の筆算くん　（４けたまで）÷（３けたまで）";
    left.appendChild(title);

    //左上
    const left_top = document.createElement("div");
    left_top.id = "left_top";
    left.appendChild(left_top);

    const label1 = document.createElement("div");
    label1.id = "label1";
    label1.classList.add("left_top_label");
    label1.textContent = "式";
    const input1 = document.createElement("input");
    input1.id = "input1";
    input1.classList.add("left_top_input");
    input1.type = "number";
    input1.min = 10;
    input1.max = 9999;
    input1.step = 1;
    input1.addEventListener("input", checkInputs);
    input1.addEventListener("blur", checkInputsNum);
    const label2 = document.createElement("div");
    label2.id = "label2";
    label2.classList.add("left_top_label");
    label2.textContent = "÷";
    const input2 = document.createElement("input");
    input2.id = "input2";
    input2.classList.add("left_top_input");
    input2.type = "number";
    input2.min = 1;
    input2.max = 999;
    input2.step = 1;
    input2.addEventListener("input", checkInputs);
    input2.addEventListener("blur", checkInputsNum);

    left_top.appendChild(label1);
    left_top.appendChild(input1);
    left_top.appendChild(label2);
    left_top.appendChild(input2);

    //左中
    const left_middle = document.createElement("div");
    left_middle.id = "left_middle";
    left.appendChild(left_middle);

    const config_container = document.createElement("div");
    config_container.id = "config_container";
    const heading1 = document.createElement("div");
    const heading2 = document.createElement("div");
    heading1.className = "heading";
    heading2.className = "heading";
    heading1.textContent = "０の計算";
    heading2.textContent = "色で強調";
    const btnCalc0 = document.createElement("button");
    const btnIsHighlight = document.createElement("button");
    btnCalc0.id = "btnCalc0";
    btnIsHighlight.id = "btnIsHighlight";
    btnCalc0.tabIndex = "-1";
    btnCalc0.addEventListener("mousedown", (e) => {
        e.preventDefault();  // フォーカス移動を防ぐ
    });
    btnIsHighlight.tabIndex = "-1";
    btnIsHighlight.addEventListener("mousedown", (e) => {
        e.preventDefault();  // フォーカス移動を防ぐ
    });
    btnCalc0.addEventListener("click", clickBtnCalc0);
    btnIsHighlight.addEventListener("click", clickBtnIdHighlight);
    setConfig();    //btnCalc0とbtnIsHighlightの設定ロード
    config_container.appendChild(heading1);
    config_container.appendChild(heading2);
    config_container.appendChild(btnCalc0);
    config_container.appendChild(btnIsHighlight);
    const left_middle_middle = document.createElement("div");
    left_middle_middle.id = "left_middle_middle";
    const btnRandom = document.createElement("button");
    btnRandom.id = "btnRandom";
    btnRandom.textContent = "ランダム";
    btnRandom.classList.add("btn_middle");
    btnRandom.classList.add("push_animation");
    btnRandom.tabIndex = "-1";
    btnRandom.addEventListener("mousedown", (e) => {
        e.preventDefault();  // フォーカス移動を防ぐ
    });
    btnRandom.addEventListener("click", clickBtnRandom);
    left_middle_middle.appendChild(btnRandom);
    const btnReset = document.createElement("button");
    btnReset.id = "btnReset";
    btnReset.textContent = "リセット";
    btnReset.classList.add("btn_middle");
    btnReset.classList.add("push_animation");
    btnReset.tabIndex = "-1";
    btnReset.addEventListener("mousedown", (e) => {
        e.preventDefault();  // フォーカス移動を防ぐ
    });
    btnReset.addEventListener("click", clickbtnReset);
    left_middle_middle.appendChild(btnReset);
    const btnNext = document.createElement("button");
    btnNext.id = "btnNext";
    btnNext.textContent = "スタート";
    btnNext.classList.add("btn_middle");
    btnNext.classList.add("push_animation");
    btnNext.tabIndex = "-1";
    btnNext.addEventListener("mousedown", (e) => {
        e.preventDefault();  // フォーカス移動を防ぐ
    });
    btnNext.addEventListener("click", clickbtnNext);

    left_middle.appendChild(config_container);
    left_middle.appendChild(left_middle_middle);
    left_middle.appendChild(btnNext);

    isVisible(btnReset, false);
    isVisible(btnNext, false);

    //左下
    const left_bottom = document.createElement("div");
    left_bottom.id = "left_bottom";
    const text_bottom = document.createElement("div");
    text_bottom.id = "text_bottom";
    text_bottom.textContent = "式を入力してください。";
    const input_container = document.createElement("div");
    input_container.id = "input_container";
    const btnLabel = [[7, 8, 9], [4, 5, 6], [1, 2, 3], ["×", 0, "けす"]];
    //10key
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
            const btn = document.createElement("button");
            btn.tabIndex = "-1";
            btn.addEventListener("mousedown", (e) => {
                e.preventDefault();  // フォーカス移動を防ぐ
            });
            btn.id = "btn" + String(row) + String(col);
            btn.classList.add("input_button");
            btn.classList.add("push_animation");
            btn.textContent = btnLabel[row][col];
            btn.addEventListener("click", function () { clickInputButton(this.textContent) });
            buttons_10key.push(btn);
            input_container.appendChild(btn);
        }
    }
    isValid10keysX = true;
    isValid10keys(true);
    changeMode10keys("Formula");
    left.appendChild(left_bottom);
    left_bottom.appendChild(text_bottom);
    left_bottom.append(input_container);

    //右
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement("div");
            cell.classList.add("square");
            // 左3列は2行目以外を透明セル
            if (col < 3 && row !== 1) {
                cell.classList.add("empty");
            } else {
                cell.classList.add("cell");
                if (col < 3) {
                    displayCells[0].push(cell);
                } else {
                    displayCells[row + 1].push(cell);
                }
            }
            allCells[row].push(cell);
            right.appendChild(cell);
        }
    }

    const curveLine = drawCurveLine();
    window.addEventListener("resize", drawCurveLine);
    isVisible(curveLine, false);
    for (let i = 1; i < 6; i++) {
        const straightLine = drawStraightLine("line", i);
        window.addEventListener("resize", function () { drawStraightLine("line", i) });
        isVisible(straightLine, false);
        straightLines.push(straightLine);
    }
    input1.focus();

    //水平線を引く
    function drawStraightLine(lineID, order) {
        //開始セルと終了セルの取得
        const cellStart = right.children[(2 * order - 1) * 7 + 3]; // ○行目△列目
        const cellEnd = right.children[(2 * order - 1) * 7 + (Number(String(dividendNum).length) + 2)]; // ○行目□列目
        //開始セル座標と終了セル座標の取得
        const rectStart = cellStart.getBoundingClientRect();
        const rectEnd = cellEnd.getBoundingClientRect();
        //ラインの太さの取得
        const lineThick = 0.5 * window.innerHeight / 100;
        //ライン（四角形）を描画
        let line = document.querySelector('#' + lineID + String(order));
        if (!line) {
            line = document.createElement('div');
            line.id = lineID + String(order);
            line.style.position = 'absolute';
            line.style.height = '0.3vw';
            line.style.background = 'black';
            //lineをbodyに追加
            document.body.appendChild(line);
        }
        line.style.left = Math.round(rectStart.left) + 'px';
        line.style.top = Math.round(rectStart.top - lineThick * 2) + 'px';
        line.style.width = Math.round(rectEnd.right - rectStart.left) + 'px';
        return line;
    }

    //縦に曲線を引く（固定）
    function drawCurveLine() {
        //ラインの太さの取得
        const lineThick = 0.6 * window.innerHeight / 100;
        //ラインのふくらみの取得
        const lineCurve = 1.8 * window.innerHeight / 100;
        //開始セルと終了セルの取得
        const cellStart = right.children[(2 - 1) * 7 + (4 - 1)]; // 2行目4列目
        const cellEnd = right.children[(3 - 1) * 7 + (4 - 1)]; // 3行目4列目
        //開始セル座標と終了セル座標の取得
        const rectStart = cellStart.getBoundingClientRect();
        const rectEnd = cellEnd.getBoundingClientRect();
        // 開始座標と終了座標（左上）
        const x1 = rectStart.left;
        const y1 = rectStart.top - lineThick * 1.5;
        const x2 = rectEnd.left;
        const y2 = rectEnd.top - lineThick * 1.5;

        // SVG 要素を作成（bodyに一度だけ追加）
        let svg = document.querySelector('#line-svg');
        if (!svg) {
            svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("id", "line-svg");
            svg.style.position = "absolute";
            svg.style.left = "0";
            svg.style.top = "0";
            svg.style.width = "100%";
            svg.style.height = "100%";
            svg.style.pointerEvents = "none"; // クリック等を無視
            document.body.appendChild(svg);
        }

        // パスを作成
        let path = document.querySelector('#my-curve');
        if (!path) {
            path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("id", "my-curve");
            path.setAttribute("stroke", "black");
            path.setAttribute("stroke-width", String(lineThick));
            path.setAttribute("fill", "none");
            svg.appendChild(path);
        }

        // 制御点（右に膨らませる）
        const offset = lineCurve; // ←どのくらい右に膨らむか
        const cx1 = x1 + offset;
        const cy1 = y1 + (y2 - y1) * 0.25;
        const cx2 = x2 + offset;
        const cy2 = y1 + (y2 - y1) * 0.75;

        // 三次ベジェ曲線
        const d = `M ${x1},${y1} C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
        path.setAttribute("d", d);

        return path;
    }

    //Lineの長さ変更
    function SetLineLength() {
        //開始セルと終了セルの取得
        for (let i = 1; i < 6; i++) {
            const cellStart = right.children[(2 * i - 1) * 7 + 3]; // ○行目△列目
            const cellEnd = right.children[(2 * i - 1) * 7 + (Number(String(dividendNum).length) + 2)]; // ○行目□列目
            const rectStart = cellStart.getBoundingClientRect();
            const rectEnd = cellEnd.getBoundingClientRect();
            let line = document.getElementById("line" + i)
            line.style.width = Math.round(rectEnd.right - rectStart.left) + 'px';
        }
    }

    //要素の表示・非表示
    function isVisible(obj, bool) {
        if (bool === true) {
            if (obj.classList.contains("invisible")) { obj.classList.remove("invisible"); }
            obj.classList.add("visible");
        } else {
            if (obj.classList.contains("visible")) { obj.classList.remove("visible"); }
            obj.classList.add("invisible");
        }
    }

    //式の完成チェック
    function checkInputs() {
        const val1 = Number(input1.value);
        const val2 = Number(input2.value);
        if (!isNaN(val1) && !isNaN(val2) && val1 >= 10 && val1 <= 9999 && val2 >= 1 && val2 <= 999) {
            isVisible(btnReset, true);
            isVisible(btnNext, true);
        } else {
            isVisible(btnReset, false);
            isVisible(btnNext, false);
        }
    }

    //入力した数値をまるめる
    function checkInputsNum() {
        if (input1.value !== "") {
            const val1 = Number(input1.value);
            if (!isNaN(val1)) {
                if (val1 > 9999) {
                    input1.value = 9999;
                    checkInputs();
                } else {
                    input1.value = Math.floor(Math.abs(val1));
                }
            }
        }
        if (input2.value !== "") {
            const val2 = Number(input2.value);
            if (!isNaN(val2)) {
                if (val2 > 999) {
                    input2.value = 999;
                    checkInputs();
                } else {
                    input2.value = Math.floor(Math.abs(val2));
                }
            }
        }
    }

    //わられる数とわる数のセット
    function SetDividendNumDivisorNum() {
        dividendNum = Number(input1.value);
        divisorNum = Number(input2.value);
    }

    //わられる数の表示
    function showDividendNumber() {
        deleteRowNum(2);
        const digit = input1.value.length;
        for (let i = 0; i < digit; i++) {
            displayCells[2][i].textContent = String(dividendNum)[i];
        }
    }

    //わる数の表示
    function showDivisorNumber() {
        deleteRowNum(0);
        const digit = input2.value.length;
        for (let i = 2; i > 2 - digit; i--) {
            displayCells[0][i].textContent = String(divisorNum)[i - (3 - digit)];
        }
    }

    //筆算数式の削除
    function deleteRowNum(row) {
        for (let i = 0; i < displayCells[row].length; i++) {
            displayCells[row][i].textContent = "";
        }
    }

    //テンキーのモード変更
    function changeMode10keys(modeFormulaOrCalc) {
        const btn = buttons_10key[9];
        if (modeFormulaOrCalc === "Formula") {
            btn.textContent = "決定";
            btn.style.backgroundColor = "red";
        } else if (modeFormulaOrCalc === "Calc") {
            btn.textContent = "×";
            btn.style.backgroundColor = "RGB(240, 240, 240)";
        }
    }

    //input用テンキーのON・OFF
    function isValid10keys(bool) {
        buttons_10key.forEach(btn => {
            if (bool && btn.textContent === "×") {  //×だけ特別処理
                btn.disabled = !isValid10keysX;
            } else {                                //その他のボタン一斉処理
                btn.disabled = !bool;
            }
            //アニメーションのON・OFF
            if (btn.disabled) { //OFF
                btn.classList = "input_button";
            } else {            //ON
                btn.classList = "input_button push_animation";
            }
        });
    }

    //btnのON・OFF
    function isValidButton(obj, bool) {
        obj.disabled = !bool;
        if (bool) {
            if (!obj.classList.contains("push_animation")) { obj.classList.add("push_animation"); }
        } else {
            if (obj.classList.contains("push_animation")) { obj.classList.remove("push_animation"); }
        }
    }

    //商のハイライト
    function highlightQuotient() {
        displayCells[1][currentDigit].className = "square highlightInput";
    }

    //現在のわり算ハイライト
    function highlightNowDivision() {
        if (isHighlight) {
            //わる数
            for (let i = 0; i < 3; i++) {
                if (displayCells[0][i].textContent !== "") {
                    displayCells[0][i].className = "square highlightDivisor"
                }
            }
            //わられる数
            getDividendNumNow();
            for (let i = 0; i <= currentDigit; i++) {
                if (displayCells[currentDividendRow][i].textContent !== "") {
                    displayCells[currentDividendRow][i].className = "square highlightDividend";
                }
            }
        }
    }

    //現在のかけ算ハイライト
    function highlightNowMultiplication() {
        if (isHighlight) {
            document.querySelectorAll(".square.highlightDividend").forEach(el => {
                el.className = "square cell";
            });
        }
    }

    //現在のひき算ハイライト
    function highlightNowSubtraction() {
        if (isHighlight) {
            //わられる数のハイライト
            for (let i = 0; i <= currentDigit; i++) {
                if (displayCells[currentDividendRow][i].textContent !== "") {
                    displayCells[currentDividendRow][i].className = "square highlightSubtraction";
                }
            }
            //積のハイライト
            for (let i = 0; i < 7; i++) {
                if (allCells[currentProductRow][i].textContent !== "") {
                    allCells[currentProductRow][i].className = "square highlightSubtraction";
                }
            }
        }
    }

    //わる数と余りのハイライト
    function highlightDivisorAndRemain() {
        if (isHighlight) {
            //わる数のハイライト
            for (let i = 0; i < 3; i++) {
                if (displayCells[0][i].textContent !== "") {
                    displayCells[0][i].className = "square highlightDivisor"
                }
            }
            //余りのハイライト
            for (let i = 0; i < displayCells[currentDividendRow + 2].length; i++) {
                if (displayCells[currentDividendRow + 2][i].textContent !== "") {
                    displayCells[currentDividendRow + 2][i].className = "square highlightRemain";
                }
            }
        }
    }

    //おろす数のハイライト
    function highlightBringDownNum(isBringDown) {
        if (isHighlight) {
            let adjustNum = 0;
            if (isBringDown) { adjustNum = 2; }
            //おろす数のハイライトON
            displayCells[2][currentDigit].className = "square highlightBringDown";
            //おろした数のハイライトON
            displayCells[currentDividendRow + adjustNum][currentDigit].className = "square highlightBringDown";
        }
    }

    //次のわられる数のハイライト
    function highlightNextDividendNum() {
        if (isHighlight) {
            for (let i = 0; i <= currentDigit; i++) {
                if (displayCells[currentDividendRow][i].textContent !== "") {
                    displayCells[currentDividendRow][i].className = "square highlightDividend";
                }
            }
        }
    }

    //商とあまりのハイライト
    function highlightAnswer() {
        if (isHighlight) {
            for (let i = 0; i < displayCells[1].length; i++) {
                //商のハイライト
                if (displayCells[1][i].textContent !== "") {
                    displayCells[1][i].className = "square highlightQuotient";
                }
                //あまりのハイライト
                if (displayCells[currentDividendRow][i].textContent !== "") {
                    displayCells[currentDividendRow][i].className = "square highlightRemain";
                }
            }
        }
    }

    //わる数のハイライト
    function highlightDivisorSpecial(col) {
        if (isHighlight) {
            for (let i = 0; i < String(divisorNum).length; i++) {
                if (col === i) {
                    displayCells[0][2 - i].className = "square highlightDivisorSpecial";
                } else {
                    displayCells[0][2 - i].className = "square highlightDivisor";
                }
            }
        }
    }

    //すべてのハイライトをOFF
    function highlightOFF(isTextOFF) {
        allCells.forEach(row => {
            row.forEach(cell => {
                if (isTextOFF) { cell.textContent = ""; }
                cell.classList.forEach(cls => {
                    if (cls.startsWith("highlight")) {
                        cell.classList.remove(cls);
                        cell.classList.add("cell");
                    };
                });
            });
        });
    }

    //現在のわられる数（dividendNumNow）の更新
    function getDividendNumNow() {
        let tmp = "";
        for (let i = 0; i <= currentDigit; i++) {
            if (displayCells[currentDividendRow][i].textContent !== "") {
                //現在のわられる数への代入
                tmp += displayCells[currentDividendRow][i].textContent;
            }
        }
        dividendNumNow = Number(tmp);
    }

    //商の入力判定
    function isInputQuotient() {
        if (inputQuotient.textContent === "") {
            isValidButton(btnNext, false);
        } else {
            isValidButton(btnNext, true);
        };
    }

    //積の表示
    function showProduct() {
        const quotient = Number(inputQuotient.textContent);
        const product = String(quotient * divisorNum);
        const answer = [];
        const explain = multiplyExplain(divisorNum, Number(inputQuotient.textContent));
        for (let i = 0; i < product.length; i++) {
            answer.push(product[i]);
        }
        const col = 3 + currentDigit;
        for (let i = 0; i < product.length; i++) {
            if (allCells[currentProductRow][col - i].textContent === "") {
                allCells[currentProductRow][col - i].textContent = answer[product.length - 1 - i];
                if (quotient === 0) {
                    text_bottom.textContent = "0に何をかけても0なので、0を書きます。";
                } else {
                    highlightDivisorSpecial(Math.min(i, String(divisorNum).length - 1));
                    text_bottom.textContent = explain[i];
                }
                console.log("i: " + i);
                console.log("product.length: " + product.length);
                console.log("i - (product.length - 1):" + (i - (product.length - 1)));
                if (i - (product.length - 1) !== 0) {
                    step--;
                }
                return;
            }
        }
    }

    //積の説明
    function multiplyExplain(multiplicand, multiplier) {
        let digits = String(multiplicand).split("").map(Number).reverse(); // 下の位から処理
        let carry = 0;
        let explanations = [];

        for (let i = 0; i < digits.length; i++) {
            let d = digits[i];
            let product = d * multiplier;
            let sum = product + carry;
            let digit = sum % 10;
            let newCarry = Math.floor(sum / 10);

            if (carry === 0) {
                // 繰り上がりなし
                if (newCarry === 0) {
                    explanations.push(`${multiplier}×${d}＝${product}　${digit}をかきます。`);
                } else {
                    explanations.push(`${multiplier}×${d}＝${product}　${digit}をかいて、${newCarry}くりあげます。`);
                }
            } else {
                // 繰り上がりあり
                if (newCarry === 0) {
                    explanations.push(`${multiplier}×${d}＝${product}　くりあげた${carry}とあわせて${sum}　${digit}をかきます。`);
                } else {
                    explanations.push(`${multiplier}×${d}＝${product}　くりあげた${carry}とあわせて${sum}　${digit}をかいて、${newCarry}くりあげます。`);
                }
            }
            carry = newCarry;
        }
        // 最後の繰り上がり
        if (carry > 0) { explanations.push(`${carry}をかきます。`); }
        // 出力
        return explanations;
    }

    //商の正しさ判定
    function judgeQuotient() {
        if (inputQuotient.textContent === "×") {
            if (dividendNumNow / divisorNum < 1) {  //正しい
                highlightOFF(false);
                highlightNowDivision();
                text_bottom.textContent = `わられる数の${dividendNumNow}よりもわる数の${divisorNum}の方が大きいので、わり算ができず、商がたちません。\n「次へ」をおして、計算を進めましょう。`;
            } else {    //正しくない（商がたつ）
                highlightOFF(false);
                highlightNowDivision();
                if (Number(dividendNumNow) > divisorNum) {
                    text_bottom.textContent = `この場合、わられる数の${dividendNumNow}よりもわる数の${divisorNum}の方が小さいので、商をたてることができそうです。\n「もどる」をおして、もう一度、商をたて直しましょう。`;
                } else if (Number(dividendNumNow) === divisorNum) {
                    text_bottom.textContent = `この場合、わられる数の${dividendNumNow}とわる数の${divisorNum}が等しいので、商をたてることができそうです。\n「もどる」をおして、もう一度、商をたて直しましょう。`;
                }
                btnNext.textContent = "もどる";
            }
        } else {
            const product = divisorNum * Number(inputQuotient.textContent);
            const remain = dividendNumNow - product;
            const quotientNow = Number(inputQuotient.textContent);
            if (remain >= 0) {
                if (remain < divisorNum) {    //正しい
                    if (isCalc0 === false && quotientNow === 0) {
                        //0の計算はしない、かつ、商は正しいとき
                        highlightOFF(false);
                        highlightNowDivision();
                        if (currentDigit === String(dividendNum).length - 1) {  //計算終了のとき
                            text_bottom.textContent = `わられる数の${dividendNumNow}よりもわる数の${divisorNum}の方が小さいので、${quotientNow}は正しい商です。\n「次へ」をおして答えをたしかめましょう。`;
                        } else {    //次の位へうつるとき
                            let delete0AtQuotient = "";
                            if (searchInvalidDigitAndIsDeleteDigit(1, false)) {
                                delete0AtQuotient = "\n商に0をたてましたが、この0は書かなくてよいので、消します。";
                            }
                            text_bottom.textContent = `わられる数の${dividendNumNow}よりもわる数の${divisorNum}の方が小さいので、${quotientNow}は正しい商です。${delete0AtQuotient}\n「次へ」をおして、次の位の数字をおろしましょう。`;
                        }
                    } else {
                        highlightNowSubtraction();
                        showSubtraction();
                        if (currentDigit === String(dividendNum).length - 1) {  //計算終了のとき
                            let remain0Message = "";
                            if (remain === 0) { remain0Message = "\nひき算のけっかが0になりましたが、最後の位の0はのこします。"; }
                            text_bottom.textContent = `わる数の${divisorNum}よりもあまりの${remain}の方が小さいので、${quotientNow}は正しい商です。${remain0Message}\n「次へ」をおして答えをたしかめましょう。`;
                            currentDividendRow = currentDividendRow + 2;
                        } else {
                            let remain0Message = "";
                            if (remain === 0) { remain0Message = "\nひき算のけっかが0になりました。この0は書きません。次の位をおろす前に消しましょう。"; }
                            let delete0AtQuotient = "";
                            if (searchInvalidDigitAndIsDeleteDigit(1, false)) { delete0AtQuotient = "\n商に0をたてましたが、この0は書かなくてよいので、消します。"; }
                            text_bottom.textContent = `わる数の${divisorNum}よりもあまりの${remain}の方が小さいので、${quotientNow}は正しい商です。${delete0AtQuotient}${remain0Message}\n「次へ」をおして、次の位の数字をおろしましょう。`;
                        }
                    }
                } else {  //商が小さい
                    if (isCalc0 === false && quotientNow === 0) {
                        //0の計算はしない、かつ、商は正しくないとき
                        highlightOFF(false);
                        highlightNowDivision();
                        if (remain === divisorNum) {
                            text_bottom.textContent = `わられる数の${dividendNumNow}とわる数の${divisorNum}が等しいです。\n商は${quotientNow}よりも大きくなりそうです。\n「もどる」をおして、もう一度、商をたて直しましょう。`;
                        } else {
                            text_bottom.textContent = `わられる数の${dividendNumNow}よりもわる数の${divisorNum}の方が大きいです。\n商は${quotientNow}よりも大きくなりそうです。\n「もどる」をおして、もう一度、商をたて直しましょう。`;
                        }
                        btnNext.textContent = "もどる";
                    } else {
                        highlightNowSubtraction();
                        showSubtraction();
                        if (remain === divisorNum) {
                            text_bottom.textContent = `わる数の${divisorNum}とあまりの${remain}が等しいです。\n商は${quotientNow}よりも大きくなりそうです。\n「もどる」をおして、もう一度、商をたて直しましょう。`;
                        } else {
                            text_bottom.textContent = `わる数の${divisorNum}よりもあまりの${remain}の方が大きいです。\n商は${quotientNow}よりも大きくなりそうです。\n「もどる」をおして、もう一度、商をたて直しましょう。`;
                        }
                        btnNext.textContent = "もどる";
                    }
                }
            } else {  //商が大きい
                highlightNowSubtraction();
                text_bottom.textContent = `この場合、${dividendNumNow}-${product}のひき算ができません。\n「もどる」をおして、${quotientNow}より小さい商をたて直しましょう。`;
                btnNext.textContent = "もどる";
            }
        }
    }

    //差の表示
    function showSubtraction() {
        isVisible(straightLines[currentLine], true);
        const quotient = Number(inputQuotient.textContent);
        const product = divisorNum * quotient;
        const result = dividendNumNow - product;
        const resultString = String(result);
        const resultArray = resultString.split("").reverse();
        const col = 3 + currentDigit;
        for (let i = 0; i < resultString.length; i++) {
            allCells[currentProductRow + 1][col - i].textContent = resultArray[i];
        }
        text_bottom.textContent = `${dividendNumNow}-${product}＝${result}`;
        highlightOFF(false);
        highlightDivisorAndRemain();
    }

    //いらない桁の検索＆削除＆フラグを返す(true:削除した　false:削除していない)
    function searchInvalidDigitAndIsDeleteDigit(rowAsDisplayCells, isDelete) {
        for (let i = 0; i < displayCells[rowAsDisplayCells].length; i++) {
            let targetCell = displayCells[rowAsDisplayCells][i];
            if (targetCell.textContent === "0") {
                if (isDelete) { targetCell.textContent = ""; }
                return true;
            } else if (targetCell.textContent !== "0" && targetCell.textContent !== "") {
                return false;
            }
        }
        return false;
    }

    //次の計算判断
    function judgeBringDownOrRedivide() {
        highlightOFF(false);
        let remain = 0;
        //商がたたないとき（×）の分岐
        if (inputQuotient.textContent === "×") {
            remain = dividendNumNow;
        } else {
            remain = dividendNumNow - (divisorNum * Number(inputQuotient.textContent));
        }
        if (remain >= 0) {
            if (remain < divisorNum) {    //正しい
                currentDigit++;
                //最後の商であれば、計算結果の表示
                if (currentDigit === String(dividendNum).length) {
                    const quotient = Math.floor(dividendNum / divisorNum);
                    const remain = dividendNum % divisorNum;
                    if (remain === 0) {
                        text_bottom.textContent = `これで計算はおしまいです。\n答えは、${quotient}(あまりなし)です。\n${divisorNum}×${quotient}(+0)で答えをたしかめてみましょう。`;
                    } else {
                        text_bottom.textContent = `これで計算はおしまいです。\n答えは、${quotient}あまり${remain}です。\n${divisorNum}×${quotient}+${remain}で答えをたしかめてみましょう。`;
                    }
                    highlightAnswer();
                    isVisible(btnNext, false);
                    return;
                } else {
                    highlightOFF(false);
                    getDividendNumNow();
                    //×か0を計算しない場合
                    if (inputQuotient.textContent === "×" || (isCalc0 === false && inputQuotient.textContent === "0" && currentDividendRow === 2)) {
                        //商の×や0を消す
                        let plusComment = "";
                        if (inputQuotient.textContent === "×") {
                            plusComment = "商の×は書かなくてよいので、消します。\n"
                        } else if (inputQuotient.textContent === "0") {
                            if (searchInvalidDigitAndIsDeleteDigit(1, true)) { plusComment = "商の0を消しました。\n"; }
                        }
                        //おろすかおろさないかの分岐
                        if (inputQuotient.textContent === "×" && currentDividendRow !== 2) { //おろす
                            highlightBringDownNum(false);
                            showDownArrow(true, false);
                            displayCells[currentDividendRow][currentDigit].textContent = displayCells[2][currentDigit].textContent;
                            text_bottom.textContent = `${plusComment}次の位に一つだけ数字をおろします。今回は${displayCells[2][currentDigit].textContent}をおろします。`;
                        } else {    //おろさない
                            highlightNextDividendNum();
                            text_bottom.textContent = `${plusComment}次の位に目を向けましょう。わられる数が${dividendNumNow}になります。`;
                        }
                    } else {    //その他の場合
                        //次の位のわられる数をおろす
                        text_bottom.textContent = "";
                        if (remain === 0) {
                            if (isCalc0) {
                                displayCells[currentDividendRow + 2][currentDigit - 1].textContent = "";
                                text_bottom.textContent = "ひき算した0を消して、"
                            } else {
                                if (inputQuotient.textContent !== "0") {
                                    displayCells[currentDividendRow + 2][currentDigit - 1].textContent = "";
                                    text_bottom.textContent = "ひき算した0を消して、"
                                }
                            }
                        }
                        let delete0AtSubtraction = "";
                        let delete0AtQuotient = "";
                        if (inputQuotient.textContent === "0" && isCalc0 === true) {
                            if (searchInvalidDigitAndIsDeleteDigit(currentDividendRow + 2, true)) { delete0AtSubtraction = "\n左の0はいらなくなったので、消します。"; }
                            highlightBringDownNum(true);
                            showDownArrow(true, true);
                            displayCells[currentDividendRow + 2][currentDigit].textContent = displayCells[2][currentDigit].textContent;
                        } else if (inputQuotient.textContent === "0" && isCalc0 === false) {
                            if (searchInvalidDigitAndIsDeleteDigit(currentDividendRow, true)) { delete0AtSubtraction = "\n左の0はいらなくなったので、消します。"; }
                            highlightBringDownNum(false);
                            showDownArrow(true, false);
                            displayCells[currentDividendRow][currentDigit].textContent = displayCells[2][currentDigit].textContent;
                        } else {
                            highlightBringDownNum(true);
                            showDownArrow(true, true);
                            displayCells[currentDividendRow + 2][currentDigit].textContent = displayCells[2][currentDigit].textContent;
                        }
                        if (inputQuotient.textContent === "0") {
                            if (searchInvalidDigitAndIsDeleteDigit(1, true)) { delete0AtQuotient = "商の0を消しました。\n"; }
                        }
                        text_bottom.textContent = text_bottom.textContent + `${delete0AtQuotient}次の位に一つだけ数字をおろします。今回は${displayCells[2][currentDigit].textContent}をおろします。${delete0AtSubtraction}`;
                    }
                }
            } else {  //商が小さい
                step = 4;
                for (let i = 0; i < 7; i++) {
                    allCells[currentProductRow][i].textContent = "";
                    allCells[currentProductRow + 1][i].textContent = "";
                }
                inputQuotient.textContent = "";
                isVisible(straightLines[currentLine], false);
                stepActions[step]();
            }
        } else {  //商が大きい
            step = 4;
            for (let i = 0; i < 7; i++) {
                allCells[currentProductRow][i].textContent = "";
            }
            inputQuotient.textContent = "";
            isVisible(straightLines[currentLine], false);
            stepActions[step]();
        }
    }

    //次の商をたてる
    function goNextDivide() {
        step = 4;
        highlightOFF(false);
        showDownArrow(false, false);
        if (inputQuotient.textContent === "×") {
            inputQuotient.textContent = "";
        } else if ((isCalc0 === false && inputQuotient.textContent === "")) {
            searchInvalidDigitAndIsDeleteDigit(1, true);
        } else {
            currentDividendRow = currentDividendRow + 2;
            currentProductRow = currentProductRow + 2;
            currentLine++;
            if (checkExistQuotient()) { isValid10keysX = false; }
        }
        stepActions[step]();
    }

    //矢印（↓）の表示ON・OFF
    function showDownArrow(isShow, isBringDown) {
        let adjustNum = 0;
        if (isBringDown) { adjustNum = 2; }
        if (isShow) {
            for (let i = 3; i < currentProductRow + adjustNum; i++) {
                displayCells[i][currentDigit].textContent = "↓";
            }
        } else {
            for (let i = 3; i < 10; i++) {
                if (displayCells[i][currentDigit].textContent === "↓") {
                    displayCells[i][currentDigit].textContent = "";
                }
            }
        }
    }

    //現在の商の有無チェック
    function checkExistQuotient() {
        for (let i = 0; i < displayCells[1].length; i++) {
            let targetCell = displayCells[1][i];
            if (targetCell.textContent !== "") {
                return true;
            }
        }
        return false;
    }

    //設定配列の保存
    function saveConfigArray(recordArray) {
        localStorage.setItem("myConfig", JSON.stringify(recordArray));
    }

    //設定配列の読み込み
    function loadConfigArray() {
        const data = localStorage.getItem("myConfig");
        return data ? JSON.parse(data) : [["する", true], ["する", true]];
    }

    //設定の更新    isCalc0: 0  isHighlight: 1
    function updateConfig(calc0OrIsHighlight, text, bool) {
        let tmp = loadConfigArray();
        tmp[calc0OrIsHighlight][0] = text;
        tmp[calc0OrIsHighlight][1] = bool;
        saveConfigArray(tmp);
    }

    //設定の表示
    function setConfig() {
        const configArray = loadConfigArray();
        btnCalc0.textContent = configArray[0][0];
        isCalc0 = configArray[0][1];
        if (isCalc0) {
            btnCalc0.className = "suru push_animation";
        } else {
            btnCalc0.className = "shinai push_animation";
        }
        btnIsHighlight.textContent = configArray[1][0];
        isHighlight = configArray[1][1];
        if (isHighlight) {
            btnIsHighlight.className = "suru push_animation";
        } else {
            btnIsHighlight.className = "shinai push_animation";
        }
    }

    //btnNextクリック時の動作
    function clickbtnNext() {
        if (step < stepActions.length) {
            stepActions[step]();
            step++;
        }
    }

    //btnResetクリック時の動作
    function clickbtnReset() {
        step = 0;
        currentDigit = 0;
        currentDividendRow = 2;
        currentProductRow = 2;
        dividendNum = 9999;
        divisorNum = 999;
        input1.value = "";
        input2.value = "";
        input1.readOnly = false;
        input2.readOnly = false;
        input1.focus();
        checkInputs();
        highlightOFF(true);
        isValidButton(btnCalc0, true);
        isValidButton(btnIsHighlight, true);
        isValidButton(btnRandom, true);
        isValidButton(btnNext, true);
        isValid10keysX = true;
        isValid10keys(true);
        changeMode10keys("Formula");
        isVisible(curveLine, false);
        for (let i = 1; i < 6; i++) {
            isVisible(document.getElementById("line" + String(i)), false);
        }
        text_bottom.textContent = "式を入力してください。";
    }

    //input_buttonクリック時の動作
    function clickInputButton(text) {
        let mode = "";
        if (buttons_10key[9].textContent === "×") {
            mode = "Calc";
        } else if (buttons_10key[9].textContent === "決定") {
            mode = "Formula";
        }
        if (mode === "Calc") {
            if (text === "けす") {
                inputQuotient.textContent = "";

            } else {
                inputQuotient.textContent = text;
            }
            isInputQuotient();
        } else if (mode === "Formula") {
            const forcusNow = document.activeElement;
            if (forcusNow.id === "input1" || forcusNow.id === "input2") {
                if (text === "けす") {
                    forcusNow.value = "";
                } else if (text === "決定") {
                    if (forcusNow.value !== "") {
                        if (input1.value === "") {
                            input1.focus();
                        } else if (input2.value === "") {
                            input2.focus();
                        } else {
                            if (input1.value > 9999) { input1.value = 9999; }
                            if (input1.value < 10) { input1.value = 10; }
                            if (input2.value > 999) { input2.value = 999; }
                            if (input2.value < 1) { input2.value = 1; }
                            isVisible(btnReset, true);
                            isVisible(btnNext, true);
                            stepActions[step]();
                            step++;
                        }
                    }
                } else {
                    if (forcusNow.id === "input1") {
                        if (String(forcusNow.value).length < 4) {
                            forcusNow.value = forcusNow.value * 10 + Number(text);
                        } else if (String(forcusNow.value).length === 4 && forcusNow.value < 9999) {
                            forcusNow.value = 9999;
                        }
                    } else if (forcusNow.id === "input2") {
                        if (String(forcusNow.value).length < 3) {
                            forcusNow.value = forcusNow.value * 10 + Number(text);
                        } else if (String(forcusNow.value).length === 3 && forcusNow.value < 999) {
                            forcusNow.value = 999;
                        }
                    }
                    checkInputs();
                }
            }
        }
    }

    //btnRandomクリック時の動作
    function clickBtnRandom() {
        let num1_999 = Math.floor(Math.random() * 999) + 1;
        let num10_9999 = Math.floor(Math.random() * (9999 - 10 + 1)) + 10;
        input1.value = Math.max(num1_999, num10_9999);
        input2.value = Math.min(num1_999, num10_9999);
        checkInputs();
    }

    //btnCalc0クリック時の動作
    function clickBtnCalc0() {
        if (btnCalc0.textContent === "する") {
            btnCalc0.textContent = "しょうりゃく";
            btnCalc0.classList.remove("suru");
            btnCalc0.classList.add("shinai");
            isCalc0 = false;
            updateConfig(0, "しょうりゃく", false);
        } else if (btnCalc0.textContent === "しょうりゃく") {
            btnCalc0.textContent = "する";
            btnCalc0.classList.remove("shinai");
            btnCalc0.classList.add("suru");
            isCalc0 = true;
            updateConfig(0, "する", true);
        }
    }

    //btnIsHighlightクリック時の動作
    function clickBtnIdHighlight(thisText) {
        if (btnIsHighlight.textContent === "する") {
            btnIsHighlight.textContent = "しない";
            btnIsHighlight.classList.remove("suru");
            btnIsHighlight.classList.add("shinai");
            isHighlight = false;
            updateConfig(1, "しない", false);
        } else if (btnIsHighlight.textContent === "しない") {
            btnIsHighlight.textContent = "する";
            btnIsHighlight.classList.remove("shinai");
            btnIsHighlight.classList.add("suru");
            isHighlight = true;
            updateConfig(1, "する", true);
        }
    }

}

