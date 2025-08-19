'use strict'

{
    //////////パブリック変数////////////////////////////////////////////////////////////////////////
    let quiz = [];  //問題格納用変数
    let quizNum = [];   //出題用問題番号変数
    let countQuizNum = 0;   //出題用問題カウント変数
    let quizMark = ["+", "+", "-", "-"];    //出題用記号変数
    let quizColor = ["rgb(250, 128, 114)", "rgb(152, 251, 152)", "rgb(135, 206, 250)", "rgb(105, 105, 105)"];
    let modeNum = 0;    //出題の種類判定用変数
    let isTest = false; //練習orテスト判定用変数
    let countMiss = 0;    //ミス数カウント用
    let isFinish = false;   //終了判定用
    let currentMode = 0;    //再挑戦用

    //タイマー用
    let startTime;  //タイマーを開始した時刻
    let elapsed = 0;    //停止までの経過時間（ms）
    let timerId = null;  //タイマーID格納用

    //音声用
    let IsMute = true;    //音声再生判定用
    const soundOK = new Audio("sounds/ok.mp3");   //正解音
    const soundNG = new Audio("sounds/ng.mp3");   //不正解音

    //////////インターフェイス生成////////////////////////////////////////////////////////////////////////
    setTopPage();
    setTestPage();
    setQuiz();
    ShowTopPage(true);

    //トップページ準備関数
    function setTopPage() {
        //タイトル
        const title = document.getElementById("title");
        title.textContent = "けいさんカード";
        const btnSound = document.createElement("button");
        btnSound.id = "btnSound";
        IsMute = loadSound();
        btnSound.addEventListener("click", function () {
            switchSound(this, !IsMute);
        });
        switchSound(btnSound, IsMute);
        title.appendChild(btnSound);

        //サブタイトル
        const subtitle = document.getElementById("subtitle");
        const label1 = document.createElement("span");
        label1.textContent = "れんしゅう"
        const space = document.createElement("div");
        const label2 = document.createElement("span");
        label2.textContent = "チャレンジ"
        subtitle.appendChild(label1);
        subtitle.appendChild(space);
        subtitle.appendChild(label2);
        //ボタンセット
        const buttonData = [
            { cls: "b1", label: "たしざん くりあがりなし" },
            { cls: "b2", label: "たしざん くりあがりあり" },
            { cls: "b3", label: "ひきざん くりさがりなし" },
            { cls: "b4", label: "ひきざん くりさがりあり" }
        ];
        const buttons = document.getElementById("buttons");
        var num = 0;
        buttonData.forEach(({ cls, label }) => {
            num++;
            const labelBtn = document.createElement("button");
            labelBtn.className = "button-label" + num;
            labelBtn.classList.add(cls);
            labelBtn.id = "practice" + num;
            labelBtn.textContent = label;
            labelBtn.dataset.mode = num * -1;
            labelBtn.addEventListener("click", function () {
                currentMode = this.dataset.mode;
                startQuiz(this.dataset.mode)
            });

            const trophyLabel = document.createElement("span");
            trophyLabel.className = "trophyLabel";
            trophyLabel.id = "trophy" + num;
            trophyLabel.textContent = "５きゅう";
            checkTrophy(trophyLabel, num);

            const timeBtn = document.createElement("button");
            timeBtn.className = "button-label" + num;
            timeBtn.classList.add(cls);
            timeBtn.id = "challenge" + num;
            timeBtn.dataset.mode = num;
            timeBtn.addEventListener("click", function () {
                currentMode = this.dataset.mode;
                startQuiz(this.dataset.mode)
            });

            buttons.appendChild(labelBtn);
            buttons.appendChild(trophyLabel);
            buttons.appendChild(timeBtn);
        });
        showRecord(loadRecord());
        document.getElementById("top-page").style.display = 'block';
        document.getElementById("quiz-page").style.display = 'none';
    }

    //問題ページ準備関数
    function setTestPage() {
        const left_label = document.getElementById("left");
        const remain_time = document.createElement("div");
        remain_time.className = "left_label";
        remain_time.id = "remain_time";
        remain_time.textContent = " 0:00"
        remain_time.classList.add("showTimer");
        remain_time.addEventListener("click", function () {
            tryAgainQuiz(this.textContent);
        });
        const remain_quiz = document.createElement("div");
        remain_quiz.className = "left_label";
        remain_quiz.id = "remain_quiz"
        remain_quiz.dataset.isfinish = false;
        remain_quiz.addEventListener("click", function () {
            goTopPage(this.dataset.isfinish);
        });
        left_label.appendChild(remain_time);
        left_label.appendChild(remain_quiz);
        const remain_quiz_num = document.createElement("span");
        remain_quiz_num.id = "remain_quiz_num";
        remain_quiz_num.classList.add("quiz_num");
        const remain_quiz_label_top_left = document.createElement("span");
        remain_quiz_label_top_left.id = "remain_quiz_label_top_left";
        remain_quiz_label_top_left.textContent = "のこり";
        const remain_quiz_label_bottom_right = document.createElement("span");
        remain_quiz_label_bottom_right.id = "remain_quiz_label_bottom_right";
        remain_quiz_label_bottom_right.textContent = "もん";
        remain_quiz.appendChild(remain_quiz_num);
        remain_quiz.appendChild(remain_quiz_label_top_left);
        remain_quiz.appendChild(remain_quiz_label_bottom_right);

        const center = document.getElementById("center");
        center.classList.add("centerBig");

        const right_label = document.getElementById("right");
        const mark_label = document.createElement("div");
        mark_label.className = "right_label";
        mark_label.id = "mark_label";
        mark_label.textContent = "○";
        const message_label = document.createElement("div");
        message_label.className = "right_label";
        message_label.id = "message_label";
        message_label.textContent = "8+9=17";
        right_label.appendChild(mark_label);
        right_label.appendChild(message_label);
        document.getElementById("top-page").style.display = 'none';
        document.getElementById("quiz-page").style.display = 'block';

        const btn1 = document.getElementById("btn1");
        const btn2 = document.getElementById("btn2");
        for (let i = 0; i < 10; i++) {
            const answerBtn1 = document.createElement("button");
            answerBtn1.className = "answerBtn";
            answerBtn1.id = "answerBtn" + i.toString();
            answerBtn1.textContent = i.toString();
            answerBtn1.addEventListener("click", function () {
                answerQuiz(parseInt(this.textContent));
            });
            const answerBtn2 = document.createElement("button");
            answerBtn2.className = "answerBtn";
            answerBtn2.id = "answerBtn" + (i + 10).toString();
            answerBtn2.textContent = (i + 10).toString();
            answerBtn2.addEventListener("click", function () {
                answerQuiz(parseInt(this.textContent));
            });
            btn1.appendChild(answerBtn1);
            btn2.appendChild(answerBtn2);
        }
    }

    //ページ切り替え関数
    function ShowTopPage(isTop) {
        if (isTop === true) {
            document.getElementById("top-page").style.display = "flex";
            document.getElementById("quiz-page").style.display = "none";
            document.body.style.backgroundColor = "rgb(255, 255, 255)";
            //記録更新////////////////////////////////////////////////////////////////
        } else {
            document.getElementById("top-page").style.display = "none";
            document.getElementById("quiz-page").style.display = "flex";
        }
    }

    //問題の準備
    function setQuiz() {
        let plus_none = [];
        let plus_up = [];
        let minus_none = [];
        let minus_down = [];
        let num_plus_none = 0;
        let num_plus_up = 0;
        let num_minus_none = 0;
        let num_minus_down = 0;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                //たしざん　（くりあがりなし・くりあがりあり）
                if (i + j < 10) {
                    plus_none[num_plus_none] = [];
                    plus_none[num_plus_none][0] = i;
                    plus_none[num_plus_none][1] = j;
                    num_plus_none++;
                } else if (i + j > 9) {
                    plus_up[num_plus_up] = [];
                    plus_up[num_plus_up][0] = i;
                    plus_up[num_plus_up][1] = j;
                    num_plus_up++;
                }
                //ひきざん(くりさがりなし)
                if (i - j >= 0) {
                    minus_none[num_minus_none] = [];
                    minus_none[num_minus_none][0] = i;
                    minus_none[num_minus_none][1] = j;
                    num_minus_none++;
                }
                //ひきざん(くりさがりあり)
                if (i !== 0) {
                    if (i + 10 - j < 10) {
                        minus_down[num_minus_down] = [];
                        minus_down[num_minus_down][0] = i + 10;
                        minus_down[num_minus_down][1] = j;
                        num_minus_down++;
                    }
                }
            }
        }
        quiz.push(plus_none);
        quiz.push(plus_up);
        quiz.push(minus_none);
        quiz.push(minus_down);
    }

    //問題番号生成関数
    function SetQuizNum(maxNum) {
        quizNum.length = 0;
        for (let i = 0; i < maxNum; i++) {
            quizNum.push(i);
        }
        for (let i = quizNum.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [quizNum[i], quizNum[j]] = [quizNum[j], quizNum[i]];
        }
    }

    function ChangeSizeText(center, BigorSmall) {
        if (BigorSmall === "Big") {
            center.classList.remove("centerSmall");
            center.classList.add("centerBig");
        } else if (BigorSmall === "Small") {
            center.classList.remove("centerBig");
            center.classList.add("centerSmall");
        }
    }

    //////////ボタンイベント////////////////////////////////////////////////////////////////////////
    //問題開始関数
    function startQuiz(mode) {
        countQuizNum = 0;
        countMiss = 0;
        isFinish = false;
        resetTimer();
        modeNum = Math.abs(mode) - 1;
        let remain_time = document.getElementById("remain_time");
        if (mode < 0) {
            isTest = false;
            showTimer("OFF");
        } else {
            isTest = true;
            showTimer("ON");
        }
        SetQuizNum(quiz[modeNum].length);
        let center = document.getElementById("center");
        ChangeSizeText(center, "Big");
        center.textContent = quiz[modeNum][quizNum[countQuizNum]][0] + quizMark[modeNum] + quiz[modeNum][quizNum[countQuizNum]][1];
        let remain_quiz_num = document.getElementById("remain_quiz_num");
        remain_quiz_num.textContent = quiz[modeNum].length;
        let remain_quiz = document.getElementById("remain_quiz");
        remain_quiz.style.backgroundColor = "rgb(255,255,255)";
        remain_quiz.style.color = "rgb(0,0,0)";
        document.getElementById("mark_label").textContent = "";
        document.getElementById("message_label").textContent = "";
        document.body.style.backgroundColor = quizColor[modeNum];
        ShowTopPage(false);
        if (isTest === true) {
            startTimer();
        }
    }

    //回答用関数
    function answerQuiz(num) {
        if (isFinish === false) {
            let answer = 0;
            if (modeNum <= 1) {
                answer = quiz[modeNum][quizNum[countQuizNum]][0] + quiz[modeNum][quizNum[countQuizNum]][1];
            } else if (modeNum >= 2) {
                answer = quiz[modeNum][quizNum[countQuizNum]][0] - quiz[modeNum][quizNum[countQuizNum]][1];
            }
            let center = document.getElementById("center");
            let remain_quiz = document.getElementById("remain_quiz");
            let remain_quiz_num = document.getElementById("remain_quiz_num");
            let remain_quiz_label_top_left = document.getElementById("remain_quiz_label_top_left");
            let remain_quiz_label_bottom_right = document.getElementById("remain_quiz_label_bottom_right");
            let remain_time = document.getElementById("remain_time");
            let mark = document.getElementById("mark_label");
            let message = document.getElementById("message_label");
            //正解判定
            if (answer === num) {
                playSound("OK");
                mark.textContent = "○";
                mark.style.color = "rgb(255,0,0)"
                message.textContent = "";
            } else if (answer !== num) {
                playSound("NG");
                mark.textContent = "×";
                mark.style.color = "rgb(68,114,196)"
                message.textContent = quiz[modeNum][quizNum[countQuizNum]][0] + quizMark[modeNum] + quiz[modeNum][quizNum[countQuizNum]][1] + "=" + answer;
                countMiss++;
                //チャレンジの場合は不正解の時点で終了
                if (isTest === true) {
                    remain_quiz_num.classList.remove("quiz_num");
                    remain_quiz_num.classList.add("finish");
                    remain_quiz_num.textContent = "おわる";
                    remain_quiz_label_top_left.classList.add("invisible");
                    remain_quiz_label_bottom_right.classList.add("invisible");
                    remain_quiz.dataset.isfinish = true;
                    remain_quiz.classList.add("cursor");
                    remain_quiz.style.backgroundColor = "rgb(255,0,0)";
                    remain_quiz.style.color = "rgb(255,255,255)";
                    if (remain_time.classList.contains("timerOFF")) {
                        remain_time.classList.remove("timerOFF");
                        remain_time.classList.add("timerON");
                    }
                    remain_time.classList.remove("showTimer");
                    remain_time.classList.add("showOnceMore");
                    remain_time.textContent = "もういちど";
                    ChangeSizeText(center, "Small");
                    center.textContent = "おしい！\nもういちどやってみよう";
                    isFinish = true;
                    stopTimer();
                }
            }
            //終了判定
            if (isFinish === false) {
                countQuizNum++;
                if (countQuizNum === quiz[modeNum].length) {
                    //終了処理
                    isFinish = true;
                    remain_quiz_num.classList.remove("quiz_num");
                    remain_quiz_num.classList.add("finish");
                    remain_quiz_num.textContent = "おわる";
                    remain_quiz_label_top_left.classList.add("invisible");
                    remain_quiz_label_bottom_right.classList.add("invisible");
                    remain_quiz.dataset.isfinish = true;
                    remain_quiz.classList.add("cursor");
                    remain_quiz.style.backgroundColor = "rgb(255,0,0)";
                    remain_quiz.style.color = "rgb(255,255,255)";
                    if (remain_time.classList.contains("timerOFF")) {
                        remain_time.classList.remove("timerOFF");
                        remain_time.classList.add("timerON");
                    }
                    remain_time.classList.remove("showTimer");
                    remain_time.classList.add("showOnceMore");
                    remain_time.textContent = "もういちど";
                    ChangeSizeText(center, "Small");
                    if (isTest === true) {
                        center.textContent = "すごい！\nぜんもんせいかい！";
                        stopTimer();
                        updateRecord(roundDownTime(elapsed));
                        showRecord(loadRecord());
                    } else {
                        if (countMiss === 0) {
                            center.textContent = "やったね！ぜんもんせいかい！\nチャレンジもやってみよう！";
                        } else if (countMiss <= 5) {
                            center.textContent = "おしい！もうちょっと！\n" + "○：" + (quiz[modeNum].length - countMiss).toString() + "　×：" + countMiss.toString();
                        } else {
                            center.textContent = "またちょうせんしてね！\n" + "○：" + (quiz[modeNum].length - countMiss).toString() + "　×：" + countMiss.toString();
                        }
                    }
                } else {
                    //次の問題へ
                    center.textContent = quiz[modeNum][quizNum[countQuizNum]][0] + quizMark[modeNum] + quiz[modeNum][quizNum[countQuizNum]][1];
                    remain_quiz_num.textContent = (parseInt(remain_quiz.textContent) - 1).toString();
                }
            }
        }
    }

    //トップページへ
    function goTopPage(isfinish) {
        if (isfinish === "true") {
            let center = document.getElementById("center");
            ChangeSizeText(center, "Big");
            for (let i = 1; i < 5; i++) {
                const trophyLabel = document.getElementById("trophy" + i.toString());
                checkTrophy(trophyLabel, i)
            }
            let remain_quiz = document.getElementById("remain_quiz");
            let remain_quiz_num = document.getElementById("remain_quiz_num");
            let remain_quiz_label_top_left = document.getElementById("remain_quiz_label_top_left");
            let remain_quiz_label_bottom_right = document.getElementById("remain_quiz_label_bottom_right");
            remain_quiz_num.textContent = "99";
            remain_quiz_num.classList.remove("finish");
            remain_quiz_num.classList.add("quiz_num");
            remain_quiz_label_top_left.classList.remove("invisible");
            remain_quiz_label_bottom_right.classList.remove("invisible");
            remain_quiz.dataset.isfinish = false;
            remain_quiz.style.backgroundColor = "rgb(255,255,255)";
            remain_quiz.style.color = "rgb(0,0,0)";
            remain_quiz.classList.remove("cursor");
            let remain_time = document.getElementById("remain_time");
            if (remain_time.classList.contains("showOnceMore")) {
                remain_time.classList.remove("showOnceMore");
                remain_time.classList.add("showTimer");
            }
            ShowTopPage(true);
        }
    }

    //問題に再挑戦
    function tryAgainQuiz(text) {
        if (text === "もういちど") {
            let remain_quiz = document.getElementById("remain_quiz");
            remain_quiz.dataset.isfinish = false;
            if (remain_quiz.classList.contains("cursor")) {
                remain_quiz.classList.remove("cursor");
            }
            let remain_time = document.getElementById("remain_time");
            if (remain_time.classList.contains("showOnceMore")) {
                remain_time.classList.remove("showOnceMore");
                remain_time.classList.add("showTimer");
            }
            if (currentMode < 0) {
                if (remain_time.classList.contains("timerON")) {
                    remain_time.classList.remove("timerON");
                    remain_time.classList.add("timerOFF");
                }
            } else {
                if (remain_time.classList.contains("timerOFF")) {
                    remain_time.classList.remove("timerOFF");
                    remain_time.classList.add("timerON");
                }
            }
            let remain_quiz_num = document.getElementById("remain_quiz_num");
            if (remain_quiz_num.classList.contains("finish")) {
                remain_quiz_num.classList.remove("finish");
                remain_quiz_num.classList.add("quiz_num");
            }
            let remain_quiz_label_top_left = document.getElementById("remain_quiz_label_top_left");
            if (remain_quiz_label_top_left.classList.contains("invisible")) {
                remain_quiz_label_top_left.classList.remove("invisible");
            }
            let remain_quiz_label_bottom_right = document.getElementById("remain_quiz_label_bottom_right");
            if (remain_quiz_label_bottom_right.classList.contains("invisible")) {
                remain_quiz_label_bottom_right.classList.remove("invisible");
            }
            startQuiz(currentMode);
        }
    }

    //タイマー関数//////////////////////////////////////////////////////////////////////////////////////
    //時間換算関数（結果表示用）
    function formatTimeResult(ms) {
        let totalSeconds = Math.floor(ms / 1000);
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        return minutes + funOrPun(minutes) + " " + seconds + "びょう";
    }

    //「ふん」か「ぷん」を返す関数
    function funOrPun(minutes) {
        const ones = minutes % 10;
        const ppunOnes = [0, 1, 3, 4, 6, 8]; // この末尾のときは「ぷん」
        return ppunOnes.includes(ones) ? "ぷん" : "ふん";
    }

    //時間換算関数（タイマー表示用）
    function formatTime(ms) {
        let totalSeconds = Math.floor(ms / 1000);
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        return String(minutes).padStart(2, ' ') + ":" + String(seconds).padStart(2, '0');
    }

    //カウントアップタイマースタート
    function startTimer() {
        if (timerId === null) {
            startTime = Date.now() - elapsed;
            timerId = setInterval(() => {
                elapsed = Date.now() - startTime;
                document.getElementById("remain_time").textContent = formatTime(elapsed);
            }, 200);
        }
    }

    //カウントアップタイマーストップ
    function stopTimer() {
        clearInterval(timerId);
        timerId = null;
    }

    //カウントアップタイマーリセット
    function resetTimer() {
        clearInterval(timerId);
        timerId = null;
        elapsed = 0;
        document.getElementById("remain_time").textContent = " 0:00";
    }

    //タイム表示のON・OFF
    function showTimer(sw) {
        let remain_time = document.getElementById("remain_time");
        if (sw === "ON") {
            remain_time.classList.remove("timerOFF");
            remain_time.classList.add("timerON");
            remain_time.textContent = " 0:00";
        } else if ("OFF") {
            remain_time.classList.remove("timerON");
            remain_time.classList.add("timerOFF");
            remain_time.textContent = "";
        }
    }

    //タイムを記録する際にミリ秒以下切り捨て
    function roundDownTime(ms) {
        return Math.floor(ms / 1000) * 1000;
    }

    //記録の保存
    function saveRecord(recordArray) {
        localStorage.setItem("myRecord", JSON.stringify(recordArray));
    }

    //記録の読み込み
    function loadRecord() {
        const data = localStorage.getItem("myRecord");
        return data ? JSON.parse(data) : [3599000, 3599000, 3599000, 3599000];
    }

    //記録の更新
    function updateRecord(newRecord) {
        let tmp = loadRecord();
        if (tmp[modeNum] > newRecord) {
            let diffSeconds = Math.floor((tmp[modeNum] - newRecord) / 1000);
            if (tmp[modeNum] === 3599000) {
                document.getElementById("center").textContent = "やったね！ぜんもんせいかい！";
            } else {
                document.getElementById("center").textContent = "やったね！しんきろく！\n" + diffSeconds + "びょうはやくなったよ！";
            }
            tmp[modeNum] = newRecord;
            saveRecord(tmp);
        } else {
            let diffSeconds = Math.floor((newRecord - tmp[modeNum]) / 1000) + 1;
            document.getElementById("center").textContent = "ぜんもんせいかい！\nしんきろくまで、あと" + diffSeconds + "びょう！";
        }
    }

    //記録の表示
    function showRecord(recordArray) {
        const btnArray = [document.getElementById("challenge1"), document.getElementById("challenge2"), document.getElementById("challenge3"), document.getElementById("challenge4")];
        for (let i = 0; i < recordArray.length; i++) {
            btnArray[i].textContent = formatTimeResult(recordArray[i]);
        }
    }

    //音の再生
    function playSound(soundName) {
        if (IsMute === false) {
            if (soundName === "OK") {
                soundOK.currentTime = 0;
                soundOK.play();
            } else if (soundName === "NG") {
                soundNG.currentTime = 0;
                soundNG.play();
            }
        }
    }

    //サウンド表示切り替え
    function switchSound(btn, bool) {
        if (bool === false) {
            if (btn.classList.contains("mute")) { btn.classList.remove("mute"); }
            btn.classList.add("on");
        } else {
            if (btn.classList.contains("on")) { btn.classList.remove("on"); }
            btn.classList.add("mute");
        }
        IsMute = bool;
        saveSound(bool);
    }

    //音声設定の保存
    function saveSound(recordArray) {
        localStorage.setItem("mySound", JSON.stringify(IsMute));
    }

    //音声設定の読み込み
    function loadSound() {
        const data = localStorage.getItem("mySound");
        return data ? JSON.parse(data) : true;
    }

    //記録の評価
    function checkTrophyName(mode, record) {
        let refValueSet = [[60000, 72000, 84000, 96000, 108000, 120000, 180000, 240000, 300000, 600000, 3599000],
        [60000, 72000, 84000, 96000, 108000, 120000, 180000, 240000, 300000, 600000, 3599000],
        [60000, 72000, 84000, 96000, 108000, 120000, 180000, 240000, 300000, 600000, 3599000],
        [60000, 72000, 84000, 96000, 108000, 120000, 180000, 240000, 300000, 600000, 3599000]];
        let refValue = refValueSet[mode - 1];
        let trophyName = ["めいじん", "５だん", "４だん", "３だん", "２だん", "しょだん", "１きゅう", "２きゅう", "３きゅう", "４きゅう", "５きゅう"];
        for (let i = 0; i < refValue.length; i++) {
            if (record < refValue[i]) {
                return trophyName[i];
            }
        }
        return "なし";
    }

    //トロフィーの表示
    function checkTrophy(obj, mode) {
        let rankStr = checkTrophyName(mode, loadRecord()[mode - 1]);
        obj.textContent = rankStr;
        if (rankStr === "なし") {
            if (obj.classList.contains("trophyON")) {
                obj.classList.remove("trophyON");
            }
            obj.classList.add("trophyOFF");
        } else {
            if (obj.classList.contains("trophyOFF")) {
                obj.classList.remove("trophyOFF");
                obj.classList.add("trophyON")
            }
            if (rankStr.includes("きゅう")) {
                obj.style.backgroundColor = "rgb(184,115,51)";
            } else if (rankStr.includes("だん")) {
                obj.style.backgroundColor = "silver";
            } else {
                obj.style.backgroundColor = "gold";
            }
        }
    }
}