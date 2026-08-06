'use strict'

{
    //ページ変数
    const topPage = document.getElementById("top-page");    //トップページ
    const quizPage = document.getElementById("quiz-page");  //問題ページ
    //オブジェクト変数
    const quiz = document.getElementById("quiz");
    const equal = document.getElementById("equal");
    const answer = document.getElementById("answer");
    const remain_number = document.getElementById("remain_number");
    const time_display = document.getElementById("time_display");
    const correct_display = document.getElementById("correct_display");
    //問題変数
    const allQuestions = [];                                //九九の問題
    let useQuestions = [];                                  //使用する問題
    let nowQnum = 0;                                        //現在の問題番号
    //タイマー変数
    let timerId = null;                                     //タイマーID
    let startTime = 0;                                      //スタートタイム
    let endTime = 0;                                        //エンドタイム
    let elapsed = 0;                                        //経過秒
    //ボタン変数
    let nowModeButton = null;                               //現在選択中のボタン（モード）
    //キーボード変数
    let CanInputByKeyboard = false;                         //キーボード操作可能フラグ
    //音声変数
    const sounds = {
        ok: new Audio("sounds/ok.mp3"),
        ng: new Audio("sounds/ng.mp3"),
        start: new Audio("sounds/start.mp3"),
        finish: new Audio("sounds/finish.mp3")
    };
    //記録用変数
    let records = {};                                       //最高記録保存用
    //メダル用変数
    const rankBorder = {
        order1: [30, 20, 15, 12],
        order2: [30, 20, 15, 12],
        order3: [30, 20, 15, 12],
        order4: [30, 20, 15, 12],
        order5: [30, 20, 15, 12],
        order6: [30, 20, 15, 12],
        order7: [30, 20, 15, 12],
        order8: [30, 20, 15, 12],
        order9: [30, 20, 15, 12],
        reverse1: [30, 20, 15, 12],
        reverse2: [30, 20, 15, 12],
        reverse3: [30, 20, 15, 12],
        reverse4: [30, 20, 15, 12],
        reverse5: [30, 20, 15, 12],
        reverse6: [30, 20, 15, 12],
        reverse7: [30, 20, 15, 12],
        reverse8: [30, 20, 15, 12],
        reverse9: [30, 20, 15, 12],
        random1: [30, 20, 15, 12],
        random2: [30, 20, 15, 12],
        random3: [30, 20, 15, 12],
        random4: [30, 20, 15, 12],
        random5: [30, 20, 15, 12],
        random6: [30, 20, 15, 12],
        random7: [30, 20, 15, 12],
        random8: [30, 20, 15, 12],
        random9: [30, 20, 15, 12],
        btn_select: [30, 20, 15, 12],
        btn_shuffle1: [35, 25, 20, 16],
        btn_shuffle2: [65, 45, 35, 28],
        btn_shuffle3: [130, 90, 70, 55],
        btn_shuffle4: [260, 180, 140, 110],
        btn_time1: [6, 8, 10, 12],
        btn_time2: [12, 16, 20, 24],
        btn_time3: [25, 32, 40, 48],
        btn_time4: [38, 48, 60, 72],
        btn_mystery1: [50, 35, 28, 22],
        btn_mystery2: [100, 70, 56, 45],
        btn_mystery3: [5, 7, 9, 11],
        btn_mystery4: [10, 14, 18, 22]
    };
    const buttonColors = [
        "#5a5753", // 未挑戦
        "#8BC34A", // 黄緑（少し鮮やか）
        "#CD7F32", // 銅
        "#D8D8D8", // 銀（少し明るい）
        "#FFC107"  // 金（少し濃い金）
    ];

    ///メニュー画面のスクリプト//////////////////////////////////////////////////////////
    loadRecords();
    setTopPage();
    setQuizPage();
    switchPage(true);
    prepareAllQuestions();
    setKeyBoardEvent();

    //トップページの準備
    function setTopPage() {
        //基本問題
        const label_basic = document.getElementById("label_basic");
        const normal_order = document.getElementById("normal_order");
        const reverse_order = document.getElementById("reverse_order");
        const random_order = document.getElementById("random_order");
        for (let i = 0; i <= 9; i++) {
            //ラベル部分
            const div1 = document.createElement("div");
            if (i === 0) {
                div1.textContent = "かけざんカード";
                div1.style.fontSize = "clamp(8px,3.5vmin,54px)";
                div1.style.fontWeight = "bold";
            } else {
                div1.textContent = toFullWidth(i.toString()) + "のだん";
                div1.style.fontSize = "clamp(8px,4.5vmin,54px)";
            }
            div1.style.display = "flex";
            div1.style.justifyContent = "center";
            div1.style.alignItems = "center";
            label_basic.appendChild(div1);
            if (i === 0) {
                //じゅんばん
                const div2 = document.createElement("div");
                div2.textContent = "じゅんばん";
                div2.style.display = "flex";
                div2.style.justifyContent = "center";
                div2.style.alignItems = "center";
                div2.style.fontSize = "clamp(8px,4vmin,54px)";
                normal_order.appendChild(div2);
                //ぎゃくから
                const div3 = document.createElement("div");
                div3.textContent = "ぎゃくから";
                div3.style.display = "flex";
                div3.style.justifyContent = "center";
                div3.style.alignItems = "center";
                div3.style.fontSize = "clamp(8px,4vmin,54px)";
                reverse_order.appendChild(div3);
                //ばらばら
                const div4 = document.createElement("div");
                div4.textContent = "ばらばら";
                div4.style.display = "flex";
                div4.style.justifyContent = "center";
                div4.style.alignItems = "center";
                div4.style.fontSize = "clamp(8px,4vmin,54px)";
                random_order.appendChild(div4);
            } else {
                //じゅんばん
                const btn2 = document.createElement("button");
                btn2.style.display = "flex";
                btn2.style.justifyContent = "center";
                btn2.style.alignItems = "center";
                btn2.style.fontSize = "clamp(8px,5vmin,54px)";
                btn2.id = "order" + i;
                if (btn2.id in records) {
                    btn2.textContent = formatTime(records[btn2.id]);
                } else {
                    btn2.textContent = "99:59";
                }
                setButtonColor(btn2, records[btn2.id]);
                btn2.dataset.dan = i;
                btn2.dataset.mode = "normal";
                btn2.dataset.num = 9;
                btn2.dataset.time = 0;
                btn2.addEventListener("pointerdown", clickMenuButton);
                normal_order.appendChild(btn2);
                //ぎゃくから
                const btn3 = document.createElement("button");
                btn3.style.display = "flex";
                btn3.style.justifyContent = "center";
                btn3.style.alignItems = "center";
                btn3.style.fontSize = "clamp(8px,5vmin,54px)";
                btn3.id = "reverse" + i;
                if (btn3.id in records) {
                    btn3.textContent = formatTime(records[btn3.id]);
                } else {
                    btn3.textContent = "99:59";
                }
                setButtonColor(btn3, records[btn3.id]);
                btn3.dataset.dan = i;
                btn3.dataset.mode = "reverse";
                btn3.dataset.num = 9;
                btn3.dataset.time = 0;
                btn3.addEventListener("pointerdown", clickMenuButton);
                reverse_order.appendChild(btn3);
                //ばらばら
                const btn4 = document.createElement("button");
                btn4.style.display = "flex";
                btn4.style.justifyContent = "center";
                btn4.style.alignItems = "center";
                btn4.style.fontSize = "clamp(8px,5vmin,54px)";
                btn4.id = "random" + i;
                if (btn4.id in records) {
                    btn4.textContent = formatTime(records[btn4.id]);
                } else {
                    btn4.textContent = "99:59";
                }
                setButtonColor(btn4, records[btn4.id]);
                btn4.dataset.dan = i;
                btn4.dataset.mode = "random";
                btn4.dataset.num = 9;
                btn4.dataset.time = 0;
                btn4.addEventListener("pointerdown", clickMenuButton);
                random_order.appendChild(btn4);
            }

        }
        //えらんで
        const select_title = document.getElementById("select_title");
        const select_checks = document.getElementById("select_checks");
        //タイトル部分
        const title1 = document.createElement("div");
        title1.textContent = "えらんで";
        title1.style.fontSize = "clamp(8px,3.5vmin,54px)";
        title1.style.display = "flex";
        title1.style.justifyContent = "center";
        title1.style.alignItems = "center";
        select_title.appendChild(title1);
        const order = [1, 6, 2, 7, 3, 8, 4, 9, 5];
        for (let i = 0; i <= 9; i++) {
            if (i !== 9) {
                //チェックボックス
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = "check" + order[i].toString();
                checkbox.dataset.dan = order[i];
                checkbox.addEventListener("pointerdown", clickCheckBox);
                const label = document.createElement("label");
                label.textContent = order[i].toString() + "のだん";
                label.classList = "labelchecks";
                label.htmlFor = "check" + order[i].toString();
                select_checks.appendChild(checkbox);
                select_checks.appendChild(label);
            } else {
                //ボタン
                const btn_select = document.createElement("button");
                btn_select.id = "btn_select";
                btn_select.classList = "double_spaces_3-4";
                btn_select.style.display = "flex";
                btn_select.style.justifyContent = "center";
                btn_select.style.alignItems = "center";
                btn_select.style.fontSize = "clamp(8px,5vmin,54px)";
                btn_select.dataset.dan = "";
                btn_select.dataset.mode = "random";
                btn_select.dataset.num = 0;
                btn_select.dataset.time = 0;
                btn_select.addEventListener("pointerdown", clickMenuButton);
                select_checks.appendChild(btn_select);
            }
        }
        //前回のチェックボックスの状態再現
        if ("settings" in records) {
            setChecks(records["settings"]);
        }
        //えらんでボタンの記録表示
        const btn_select = document.getElementById("btn_select");
        const key = btn_select.dataset.dan;
        if ("btn_select" in records) {
            if (key in records["btn_select"]) {
                btn_select.textContent = formatTime(records["btn_select"][key]);
                setButtonColor(btn_select, records[btn_select.id][key]);
            } else {
                btn_select.textContent = "99:59";
                setButtonColor(btn_select, records[btn_select.id]);
            }
        } else {
            btn_select.textContent = "99:59";
            setButtonColor(btn_select, records[btn_select.id]);
        }
        //シャッフル
        const shuffle_title = document.getElementById("shuffle_title");
        const shuffle_buttons = document.getElementById("shuffle_buttons");
        //タイトル
        const title2 = document.createElement("div");
        title2.textContent = "シャッフル";
        title2.style.fontSize = "clamp(8px,3.5vmin,54px)";
        title2.style.display = "flex";
        title2.style.justifyContent = "center";
        title2.style.alignItems = "center";
        shuffle_title.appendChild(title2);
        const strings_shuffle = ["10", "20", "40", "81"];
        for (let i = 0; i < 4; i++) {
            //ラベル
            const label_shuffle = document.createElement("div");
            label_shuffle.textContent = strings_shuffle[i] + "もん";
            label_shuffle.style.fontSize = "clamp(8px,5vmin,54px)";
            label_shuffle.style.display = "flex";
            label_shuffle.style.justifyContent = "center";
            label_shuffle.style.alignItems = "center";
            //ボタン
            const btn_shuffle = document.createElement("button");
            btn_shuffle.id = "btn_shuffle" + (i + 1).toString();
            if (btn_shuffle.id in records) {
                btn_shuffle.textContent = formatTime(records[btn_shuffle.id]);
            } else {
                btn_shuffle.textContent = "99:59";
            }
            setButtonColor(btn_shuffle, records[btn_shuffle.id]);
            btn_shuffle.style.display = "flex";
            btn_shuffle.style.justifyContent = "center";
            btn_shuffle.style.alignItems = "center";
            btn_shuffle.style.fontSize = "clamp(8px,5vmin,54px)";
            btn_shuffle.dataset.dan = 0;
            btn_shuffle.dataset.mode = "random";
            btn_shuffle.dataset.num = strings_shuffle[i];
            btn_shuffle.dataset.time = 0;
            btn_shuffle.addEventListener("pointerdown", clickMenuButton);
            shuffle_buttons.appendChild(label_shuffle);
            shuffle_buttons.appendChild(btn_shuffle);
        }
        //タイム
        const time_title = document.getElementById("time_title");
        const time_buttons = document.getElementById("time_buttons");
        //タイトル
        const title3 = document.createElement("div");
        title3.textContent = "タイム";
        title3.style.fontSize = "clamp(8px,3.5vmin,54px)";
        title3.style.display = "flex";
        title3.style.justifyContent = "center";
        title3.style.alignItems = "center";
        time_title.appendChild(title3);
        const strings_time = ["15", "30", "60", "90"];
        for (let i = 0; i < 4; i++) {
            //ラベル
            const label_time = document.createElement("div");
            label_time.textContent = strings_time[i] + "びょう";
            label_time.style.fontSize = "clamp(8px,5vmin,54px)";
            label_time.style.display = "flex";
            label_time.style.justifyContent = "center";
            label_time.style.alignItems = "center";
            //ボタン
            const btn_time = document.createElement("button");
            btn_time.id = "btn_time" + (i + 1).toString();
            if (btn_time.id in records) {
                btn_time.textContent = records[btn_time.id] + "もん";
            } else {
                btn_time.textContent = "0もん";
            }
            setButtonColor(btn_time, records[btn_time.id]);
            btn_time.style.display = "flex";
            btn_time.style.justifyContent = "center";
            btn_time.style.alignItems = "center";
            btn_time.style.fontSize = "clamp(8px,5vmin,54px)";
            btn_time.dataset.dan = 0;
            btn_time.dataset.mode = "random";
            btn_time.dataset.num = 162;
            btn_time.dataset.time = strings_time[i];
            btn_time.addEventListener("pointerdown", clickMenuButton);
            time_buttons.appendChild(label_time);
            time_buttons.appendChild(btn_time);
        }

        //ミステリー
        const mystery_title = document.getElementById("mystery_title");
        const mystery_buttons = document.getElementById("mystery_buttons");
        //タイトル
        const title4 = document.createElement("div");
        title4.textContent = "ミステリー";
        title4.style.fontSize = "clamp(8px,3.5vmin,54px)";
        title4.style.display = "flex";
        title4.style.justifyContent = "center";
        title4.style.alignItems = "center";
        mystery_title.appendChild(title4);
        const strings_mystery = ["10", "20", "30", "60"];
        for (let i = 0; i < 4; i++) {
            //ラベル
            const label_mystery = document.createElement("div");
            if (i < 2) {
                label_mystery.textContent = strings_mystery[i] + "もん";
            } else {
                label_mystery.textContent = strings_mystery[i] + "びょう";
            }
            label_mystery.style.fontSize = "clamp(8px,5vmin,54px)";
            label_mystery.style.display = "flex";
            label_mystery.style.justifyContent = "center";
            label_mystery.style.alignItems = "center";
            //ボタン
            const btn_mystery = document.createElement("button");
            btn_mystery.id = "btn_mystery" + (i + 1).toString();
            btn_mystery.style.display = "flex";
            btn_mystery.style.justifyContent = "center";
            btn_mystery.style.alignItems = "center";
            btn_mystery.style.fontSize = "clamp(8px,5vmin,54px)";
            btn_mystery.dataset.dan = 0;
            btn_mystery.dataset.mode = "random";
            if (i < 2) {
                btn_mystery.dataset.num = strings_mystery[i];
                btn_mystery.dataset.time = 0;
                if (btn_mystery.id in records) {
                    btn_mystery.textContent = formatTime(records[btn_mystery.id]);
                } else {
                    btn_mystery.textContent = "99:59";
                }
            } else {
                btn_mystery.dataset.num = 162;
                btn_mystery.dataset.time = strings_mystery[i];
                if (btn_mystery.id in records) {
                    btn_mystery.textContent = records[btn_mystery.id] + "もん";
                } else {
                    btn_mystery.textContent = "0もん";
                }
            }
            setButtonColor(btn_mystery, records[btn_mystery.id]);
            btn_mystery.addEventListener("pointerdown", clickMenuButton);
            mystery_buttons.appendChild(label_mystery);
            mystery_buttons.appendChild(btn_mystery);
        }
    }

    //クイズページの準備
    function setQuizPage() {
        //式
        quiz.textContent = ""
        quiz.style.display = "flex";
        quiz.style.justifyContent = "center";
        quiz.style.alignItems = "center";
        quiz.style.fontSize = "clamp(20px,30vmin,154px)";
        //イコール
        equal.textContent = "=";
        equal.style.display = "flex";
        equal.style.justifyContent = "center";
        equal.style.alignItems = "center";
        equal.style.fontSize = "clamp(20px,30vmin,154px)";
        //回答蘭
        answer.textContent = "";
        answer.style.display = "flex";
        answer.style.justifyContent = "center";
        answer.style.alignItems = "center";
        answer.style.fontSize = "clamp(20px,30vmin,154px)";
        //残りラベル
        const remain_label = document.getElementById("remain_label");
        remain_label.textContent = "のこり";
        remain_label.style.display = "flex";
        remain_label.style.justifyContent = "left";
        remain_label.style.alignItems = "flex-end";
        remain_label.style.fontSize = "clamp(20px,5vmin,64px)";
        //残り表示
        remain_number.textContent = "";
        remain_number.style.display = "flex";
        remain_number.style.justifyContent = "center";
        remain_number.style.alignItems = "center";
        remain_number.style.fontSize = "clamp(20px,20vmin,120px)";
        //残り単位
        const remain_unit = document.getElementById("remain_unit");
        remain_unit.textContent = "もん";
        remain_unit.style.display = "flex";
        remain_unit.style.justifyContent = "left";
        remain_unit.style.alignItems = "center";
        remain_unit.style.fontSize = "clamp(20px,5vmin,64px)";
        //○×表示
        const judge_area = document.getElementById("judge_area");
        judge_area.style.backgroundSize = "contain";
        judge_area.style.backgroundRepeat = "no-repeat";
        judge_area.style.backgroundPosition = "center";
        judge_area.style.backgroundImage = "";
        //タイムラベル
        const time_label = document.getElementById("time_label");
        time_label.textContent = "じかん";
        time_label.style.display = "flex";
        time_label.style.justifyContent = "left";
        time_label.style.alignItems = "flex-end";
        time_label.style.fontSize = "clamp(20px,5vmin,64px)";
        //タイム表示
        const time_display = document.getElementById("time_display");
        time_display.textContent = "";
        time_display.style.display = "flex";
        time_display.style.justifyContent = "center";
        time_display.style.alignItems = "center";
        time_display.style.fontSize = "clamp(20px,20vmin,120px)";
        //正答ラベル
        const correct_label = document.getElementById("correct_label");
        correct_label.textContent = "正しいこたえ";
        correct_label.style.display = "flex";
        correct_label.style.justifyContent = "left";
        correct_label.style.alignItems = "flex-end";
        correct_label.style.fontSize = "clamp(20px,5vmin,64px)";
        //正答表示
        correct_display.textContent = "";
        correct_display.style.display = "flex";
        correct_display.style.justifyContent = "center";
        correct_display.style.alignItems = "center";
        correct_display.style.fontSize = "clamp(20px,12vmin,80px)";
        //テンキー
        const keys = [
            "7", "8", "9",
            "4", "5", "6",
            "1", "2", "3",
            "0", "けす", "OK"
        ];
        const keypad = document.getElementById("keypad");
        keys.forEach(key => {
            const button = document.createElement("button");
            button.textContent = key;
            button.id = key;
            if (key === "けす") {
                button.classList.add("keydelete");
            } else if (key === "OK") {
                button.classList.add("keyok");
            } else {
                button.classList.add("keynumber");
            }
            button.addEventListener("pointerdown", clickTenKey);
            keypad.appendChild(button);
        });
    }

    //トップ・クイズ画面の切り替え
    function switchPage(isTop) {
        topPage.style.display = isTop ? "flex" : "none";
        quizPage.style.display = isTop ? "none" : "flex";
        if (isTop === false) {
            document.getElementsByClassName("keydelete")[0].textContent = "けす";
            document.getElementsByClassName("keyok")[0].textContent = "OK";
        }
    }

    //menu buttonクリック時の動作
    function clickMenuButton(event) {
        let arrayDan = [];
        if (event.target.dataset.dan === "") {
            return;
        } else if (event.target.dataset.dan === "0") {
            arrayDan = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        } else {
            let tmpDan = event.target.dataset.dan;
            arrayDan = tmpDan.split("").map(Number);
            event.target.dataset.num = tmpDan.length * 9;
        }
        if (event.target.id.startsWith("btn_mystery")) {
            useQuestions = GetMysteryQuestions(Number(event.target.dataset.num));
        } else {
            useQuestions = GetUseQuestions(arrayDan, event.target.dataset.mode, event.target.dataset.num);
        }
        if (event.target.dataset.num === "162") {
            useQuestions.push(...GetUseQuestions(arrayDan, event.target.dataset.mode, event.target.dataset.num));
        }
        //問題番号リセット
        nowQnum = 0;
        //問題表示
        ShowQuestion();
        //ミステリー判定
        if (event.target.id.startsWith("btn_mystery")) {
            equal.textContent = "▢=";
            fitText(equal);
        } else {
            equal.textContent = "=";
            equal.style.fontSize = "clamp(20px,30vmin,154px)";
        }
        //回答欄クリア
        answer.textContent = "";
        //正しい答え表示なし
        correct_display.textContent = "";
        correct_display.style.fontSize = "clamp(20px,12vmin,80px)";
        //問題数表示
        if (event.target.dataset.num === "162") {
            remain_number.textContent = formatNumber("0");
            document.getElementById("remain_label").textContent = "いま";
        } else {
            remain_number.textContent = formatNumber(event.target.dataset.num);
            document.getElementById("remain_label").textContent = "のこり";
        }
        //時間表示
        if (event.target.dataset.time === "0") {
            startCountUp();
        } else {
            startCountDown(Number(event.target.dataset.time));
        }
        switchResultImage("none");
        switchPage(false);
        sounds.start.play();
        nowModeButton = event.target;
        //テンキー制限解除
        startTenkey();
        CanInputByKeyboard = true;
    }

    //問題表示用関数
    function ShowQuestion() {
        const q = useQuestions[nowQnum];
        const sp = "\u00A0";    //半角程度の空白
        if (q.hidden === "dan") {
            quiz.textContent =
                "▢" + sp + "×" + formatNumber(q.kake) + "=" + isSpace(q.answer) + formatNumber(q.answer);
        } else if (q.hidden === "kake") {
            quiz.textContent =
                formatNumber(q.dan) + "×" + sp + "▢" + sp + "=" + isSpace(q.answer) + formatNumber(q.answer);
        } else {
            quiz.textContent =
                formatNumber(q.dan) + "×" + formatNumber(q.kake);
        }
    }

    //見た目調整（1桁ならスペースなし、2桁ならスペースあり）
    function isSpace(num) {
        if (num.length === 1) {
            return "";
        } else {
            const sp = "\u00A0";    //半角程度の空白
            return sp;
        }
    }

    //タイマーカウントアップ関数
    function startCountUp() {
        startTime = Date.now();
        timerId = setInterval(updateCountUp, 1000);
    }

    //カウントアップアップデート
    function updateCountUp() {
        elapsed = Math.floor((Date.now() - startTime) / 1000);
        time_display.textContent = formatTime(elapsed);
    }

    //タイマーカウントダウン関数
    function startCountDown(limit) {
        endTime = Date.now() + limit * 1000;
        timerId = setInterval(updateCountDown, 1000);
    }

    //カウントダウンアップデート
    function updateCountDown() {
        const remain_time = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        time_display.textContent = formatTime(remain_time);
        if (remain_time === 0) {
            //終了処理
            finishChallenge(true);
        }
    }

    //タイマーストップ
    function stopTimer() {
        clearInterval(timerId);
        timerId = null;
    }

    //秒→00：00変換
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;

        return String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
    }

    //00:00→秒変換
    function parseTime(time) {
        const parts = time.split(":");

        const min = Number(parts[0]);
        const sec = Number(parts[1]);

        return min * 60 + sec;
    }

    //○×表示切替
    function switchResultImage(strState) {
        const resultImage = document.getElementById("judge_area");
        if (strState === "maru") {
            resultImage.style.backgroundImage = "url(img/maru.png)";
            resultImage.style.display = "block";
        } else if (strState === "batsu") {
            resultImage.style.backgroundImage = "url(img/batsu.png)";
            resultImage.style.display = "block";
        } else if (strState === "none") {
            resultImage.style.backgroundImage = "";
            resultImage.style.display = "none";
        }
    }

    //checkboxクリック時の動作
    function clickCheckBox(event) {
        judgeCheckBox();
        setBtn_SelectRecords();
    }

    //checkboxの状態を取得
    function judgeCheckBox() {
        let dan = "";
        const checks = document.querySelectorAll('[id*="check"]');
        checks.forEach(check => {
            if (check.checked) {
                dan += check.dataset.dan;
            }
        });
        dan = dan.split("").sort().join("");
        document.getElementById("btn_select").dataset.dan = dan;
        saveSettings(dan);
    }

    //チェックボックスの自動セット
    function setChecks(str) {
        for (let i = 1; i <= 9; i++) {
            document.getElementById(`check${i}`).checked = str.includes(String(i));
        }
        judgeCheckBox();
    }

    //えらんでボタンの記録表示
    function setBtn_SelectRecords() {
        const btn_select = document.getElementById("btn_select");
        const key = btn_select.dataset.dan;
        if ("btn_select" in records) {
            if (key in records["btn_select"]) {
                btn_select.textContent = formatTime(records[btn_select.id][key]);
                setButtonColor(btn_select, records[btn_select.id][key]);
            } else {
                btn_select.textContent = "99:59";
                setButtonColor(btn_select, records[btn_select.id]);
            }
        } else {
            btn_select.textContent = "99:59";
            setButtonColor(btn_select, records[btn_select.id]);
        }
    }

    //問題の準備
    function prepareAllQuestions() {
        for (let dan = 1; dan <= 9; dan++) {
            for (let kake = 1; kake <= 9; kake++) {
                allQuestions.push({
                    dan: dan,
                    kake: kake,
                    answer: dan * kake
                });
            }
        }
    }

    //ミステリー問題作成関数
    function GetMysteryQuestions(num) {
        let mysteryQuestions = [];
        allQuestions.forEach(q => {
            // kakeを隠す問題
            mysteryQuestions.push({
                dan: q.dan,
                kake: q.kake,
                answer: q.answer,
                hidden: "kake"
            });
            // danを隠す問題
            mysteryQuestions.push({
                dan: q.dan,
                kake: q.kake,
                answer: q.answer,
                hidden: "dan"
            });
        });
        shuffle(mysteryQuestions);
        return mysteryQuestions.slice(0, num);
    }

    //問題を取得
    function GetUseQuestions(dan, mode, num) {
        let tmpQuestions;

        if (dan.length === 9) {
            tmpQuestions = [...allQuestions];
        } else {
            tmpQuestions = allQuestions.filter(q =>
                dan.includes(q.dan)
            );
        }

        switch (mode) {
            case "reverse":
                tmpQuestions.reverse();
                break;
            case "random":
                shuffle(tmpQuestions);
                break;
        }

        return tmpQuestions.slice(0, num);
    }

    //シャッフル関数
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    //テンキーをクリックしたときの動作
    function clickTenKey(event) {
        inputTenkey(event.target.textContent);
    }

    //テンキー入力処理
    function inputTenkey(btntext) {
        if (btntext === "けす") {
            answer.textContent = "";
        } else if (btntext === "OK") {
            if (answer.textContent === "") return;
            if (CheckAnswer()) {
                //答えを空に
                answer.textContent = "";
                //問題数表示
                const labelTxt = document.getElementById("remain_label").textContent;
                if (labelTxt === "いま") {
                    remain_number.textContent = formatNumber(Number(toHalfWidth(remain_number.textContent)) + 1);

                } else if (labelTxt === "のこり") {
                    remain_number.textContent = formatNumber(Number(toHalfWidth(remain_number.textContent)) - 1);
                }
                //次の問題番号へ
                nowQnum++;
                //終了判定/////////////////////////////////
                if (nowQnum === useQuestions.length) {
                    //ok音を鳴らす
                    playSoundsOK();
                    //終了処理
                    finishChallenge(true);
                } else {
                    //次の問題を表示
                    ShowNextQuestion();
                    //ok音を鳴らす
                    playSoundsOK();
                }
            } else {
                //終了処理
                finishChallenge(false);
            }
        } else if (btntext === "おわる") {
            switchPage(true);
        } else if (btntext === "また") {
            nowModeButton.click();
            document.activeElement.blur();
            sounds.start.play();
        } else {
            if (answer.textContent.length <= 1) {
                answer.textContent = answer.textContent + btntext;
            }
        }
    }

    //答え確認関数
    function CheckAnswer() {
        const q = useQuestions[nowQnum];
        let correct;
        if (q.hidden === "kake") {
            correct = q.kake;
        } else if (q.hidden === "dan") {
            correct = q.dan;
        } else {
            correct = q.answer;
        }
        return Number(answer.textContent) === correct;
    }

    //終了時のテンキー動作制限
    function stopTenkey() {
        const btnNum = document.querySelectorAll(".keynumber");
        btnNum.forEach(button => {
            button.disabled = true;
        });
        //ボタン表示変更
        document.getElementsByClassName("keydelete")[0].textContent = "おわる";
        document.getElementsByClassName("keyok")[0].textContent = "また";
    }

    //開始時のテンキー動作制限解除
    function startTenkey() {
        const btnNum = document.querySelectorAll(".keynumber");
        btnNum.forEach(button => {
            button.disabled = false;
        });
        //ボタン表示変更
        document.getElementsByClassName("keydelete")[0].textContent = "けす";
        document.getElementsByClassName("keyok")[0].textContent = "OK";
    }

    //キーボード制御
    function setKeyBoardEvent() {
        document.addEventListener("keydown", (event) => {
            if (!CanInputByKeyboard) return;
            if (event.key >= "0" && event.key <= "9") {
                event.preventDefault();
                inputTenkey(event.key);
                return;
            }
            if (event.key === "Enter") {
                event.preventDefault();
                inputTenkey("OK");
                return;
            }
            if (event.key === "Backspace" || event.key === "Delete") {
                event.preventDefault();
                inputTenkey("けす");
                return;
            }
        });
    }

    //次の問題表示
    function ShowNextQuestion() {
        ShowQuestion();
    }

    //終了処理
    async function finishChallenge(isSuccess) {
        //テンキー制限
        stopTenkey();
        CanInputByKeyboard = false;
        //成功・失敗で分岐
        if (isSuccess) {
            const RECORD_SCORE = "162";
            let record;
            if (nowModeButton.dataset.num === RECORD_SCORE) {
                record = Number(toHalfWidth(remain_number.textContent));
            } else {
                record = parseTime(time_display.textContent);
            }
            const isNewRecord = saveBestRecord(nowModeButton.dataset.dan, nowModeButton.dataset.num, record);
            correct_display.textContent = getResultMessage(isNewRecord, nowModeButton.id, record);
            fitText(correct_display);
        } else {
            //正答を示す
            correct_display.textContent = formatNumber(useQuestions[nowQnum].dan) + "×" + formatNumber(useQuestions[nowQnum].kake) + "=" + formatNumber(useQuestions[nowQnum].answer);
            fitText(correct_display);
            //ng音を鳴らす(再生終了を待つ)
            await playSound(sounds.ng);
        }
        //finish音を鳴らす
        playSoundsFinish();
        //タイマーを止める
        stopTimer();
    }

    //半角英数字を全角に変換
    function toFullWidth(str) {
        str = str.replace(/[A-Za-z0-9]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
        });
        return str;
    }

    //1桁全角2桁以上半角表示
    function formatNumber(num) {
        const str = String(num);

        if (str.length === 1) {
            // 1桁なら全角化
            return str.replace(/[0-9]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
            });
        } else {
            // 2桁以上ならそのまま
            return str;
        }
    }

    //ランクによるボタンの色付け
    function setButtonColor(button, record) {
        const rank = getRank(button.id, record);
        button.style.backgroundColor = buttonColors[rank];
        button.classList.toggle("gold", rank === 4);
    }

    //ランクを返す関数
    function getRank(buttonId, record) {
        // 未挑戦
        if (record === undefined) {
            return 0;
        }
        const border = rankBorder[buttonId];
        if (!border) {
            return 0;
        }
        // 問題数モード
        if (buttonId.startsWith("btn_time") || buttonId === "btn_mystery3" || buttonId === "btn_mystery4") {
            if (record >= border[3]) return 4;
            if (record >= border[2]) return 3;
            if (record >= border[1]) return 2;
            if (record >= border[0]) return 1;
        } else {
            // タイムモード
            if (record <= border[3]) return 4;
            if (record <= border[2]) return 3;
            if (record <= border[1]) return 2;
            if (record <= border[0]) return 1;
        }
        return 0;
    }

    //全角数字を半角数字に
    function toHalfWidth(str) {
        return str.replace(/[０-９]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
    }

    //localstrageに記録する
    function saveRecords() {
        localStorage.setItem(
            "records",
            JSON.stringify(records)
        );
    }

    //localstrageから記録を読み込む
    function loadRecords() {
        const data = localStorage.getItem("records");
        if (data !== null) {
            records = JSON.parse(data);
        } else {
            records = {};
        }
    }

    //recordsにチェックボックスのsettingsを保存
    function saveSettings() {
        const btn_select = document.getElementById("btn_select");
        records["settings"] = btn_select.dataset.dan;
        saveRecords();
    }

    //ベスト記録更新
    function saveBestRecord(dan, num, record) {
        const key = nowModeButton.id;
        const RECORD_SCORE = 162;
        let isNewRecord = false;
        if (key === "btn_select") {     //「えらんで」の場合
            if (!(key in records)) {
                // 初回登録
                records[key] = {};
                isNewRecord = true;
            } else {
                // タイム競争（少ない方が新記録）
                isNewRecord = record < records[key];
            }
            if (isNewRecord) {
                records[key][dan] = record;
                saveRecords();
                nowModeButton.textContent = formatTime(record);
                console.log(nowModeButton.id);
                setButtonColor(nowModeButton, records[key][dan]);
                return true;
            }
        } else {    //「えらんで」以外
            if (!(key in records)) {
                // 初回登録
                isNewRecord = true;
            } else if (Number(num) === RECORD_SCORE) {
                // タイムアタック（多い方が新記録）
                isNewRecord = record > records[key];
            } else {
                // タイム競争（少ない方が新記録）
                isNewRecord = record < records[key];
            }
            if (isNewRecord) {
                records[key] = record;
                saveRecords();
                if (Number(num) === RECORD_SCORE) {
                    nowModeButton.textContent = record + "もん";
                } else {
                    nowModeButton.textContent = formatTime(record);
                }
                setButtonColor(nowModeButton, records[key]);
                return true;
            }
        }
        return false;
    }

    //終了メッセージ作成
    function getResultMessage(isNewRecord, key, record) {
        const messagesNewRecord = ["しんきろく🎉", "しんきろく🎊", "しんきろく👏", "しんきろく🥇", "しんきろく🌈"];
        if (isNewRecord) {
            return randomMessage(messagesNewRecord);
        }
        const info = getRankInfo(key, record);
        const messagesGold = ["きんメダル🏅", "さいこう！🏆", "マスター！👑", "かんぺき！✨", "めいじん！🥰"];
        if (!info) return "";
        // すでに金
        if (info.rank === 4) {
            return randomMessage(messagesGold);
        }
        const isScore =
            key.startsWith("btn_time") ||
            key === "btn_mystery3" ||
            key === "btn_mystery4";
        let diff;
        if (isScore) {
            // 問題数は多い方が良い
            diff = info.next - record;
        } else {
            // タイムは少ない方が良い
            diff = record - info.next;
        }
        // 次のランク名
        const rankNames = [
            "きみどり",
            "どう",
            "ぎん",
            "きん"
        ];
        const nextRank = rankNames[info.rank];
        if (diff === 1) {
            return `おしい！あと１${isScore ? "もん" : "びょう"}で${nextRank}！`;
        }
        if (diff <= 3) {
            return `あと${diff}${isScore ? "もん" : "びょう"}で${nextRank}！`;
        }
        return `つぎは${nextRank}をめざそう！`;
    }

    //ランダムメッセージ
    function randomMessage(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    //ランク取得関数
    function getRankInfo(key, record) {
        const border = rankBorder[key];

        if (!border) return null;

        const isScore = key.startsWith("btn_time") || key === "btn_mystery4";

        if (isScore) {
            // 多いほど良い
            if (record >= border[3]) {
                return {
                    rank: 4,
                    next: null
                };
            } else if (record >= border[2]) {
                return {
                    rank: 3,
                    next: border[3]
                };
            } else if (record >= border[1]) {
                return {
                    rank: 2,
                    next: border[2]
                };
            } else if (record >= border[0]) {
                return {
                    rank: 1,
                    next: border[1]
                };
            } else {
                return {
                    rank: 0,
                    next: border[0]
                };
            }

        } else {
            // 少ないほど良い
            if (record <= border[3]) {
                return {
                    rank: 4,
                    next: null
                };
            } else if (record <= border[2]) {
                return {
                    rank: 3,
                    next: border[3]
                };
            } else if (record <= border[1]) {
                return {
                    rank: 2,
                    next: border[2]
                };
            } else if (record <= border[0]) {
                return {
                    rank: 1,
                    next: border[1]
                };
            } else {
                return {
                    rank: 0,
                    next: border[0]
                };
            }
        }
    }

    //文字サイズの自動調整
    function fitText(div) {
        let size = 80;
        div.style.fontSize = size + "px";
        while (
            (div.scrollWidth > div.clientWidth ||
                div.scrollHeight > div.clientHeight) &&
            size > 16
        ) {
            size--;
            div.style.fontSize = size + "px";
        }
    }

    //ok音を鳴らす（待たない）
    function playSoundsOK() {
        sounds.ok.currentTime = 0;
        sounds.ok.play();
    }

    //ng音を鳴らす（待たない）
    function playSoundsNG() {
        sounds.ng.currentTime = 0;
        sounds.ng.play();
    }

    //finish音を鳴らす（待たない）
    function playSoundsFinish() {
        sounds.finish.currentTime = 0;
        sounds.finish.play();
    }

    //音を鳴らす（再生終了を待つ用）
    function playSound(audio) {
        return new Promise((resolve) => {
            audio.currentTime = 0;

            audio.onended = () => {
                resolve();
            };

            audio.play();
        });
    }
}
