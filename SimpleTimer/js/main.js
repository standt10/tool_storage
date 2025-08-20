'use strict'

{
    /////////パブリック変数/////////////////////////////////////////////////////////////////////////////
    const adjustButton = document.getElementById("adjust-button");
    const timer = document.getElementById("timer");
    const setButton = document.getElementById("set-button");
    const actionButton = document.getElementById("action-button");
    const changeset = document.getElementById("change-set");
    const audioFiles = [];
    let audioNum = 0;
    const audioString = ["ｱﾗｰﾑ", "ﾎｲｯｽﾙ", "ｺﾞﾝｸﾞ", "ﾁｬｲﾑ", "ｺｹｺｯｺｰ", "ﾋﾋｰﾝ"];

    let state = "start";
    let timerID;
    let elapsedMs = 0;
    let totalMs = 0;

    /////////インターフェイス生成///////////////////////////////////////////////////////////////////////
    //timer-bg非表示
    HideElementByID("timer-bg", "hidden");

    //adjustボタン生成
    const adjStrings = [10, 5, 1, 10, 5, 1];
    const fragmentAdj = document.createDocumentFragment();
    for (let i = 0; i < adjStrings.length; i++) {
        let adjBtn = document.createElement('div');
        adjBtn.classList.add("adjBtnGroup");
        const adjButton = document.createElement('button');
        adjButton.textContent = '+' + adjStrings[i];
        let text;
        if (i < 3) {
            text = 'm' + adjStrings[i];
            adjButton.classList.add("adjBtnM");
        } else {
            text = 's' + adjStrings[i];
            adjButton.classList.add("adjBtnS");
        }
        adjButton.id = text;
        adjBtn.appendChild(adjButton);
        fragmentAdj.appendChild(adjBtn);
    }
    adjustButton.appendChild(fragmentAdj);

    //タイマーセットボタン５個を生成
    const setStringsDefault = ["00:03", "03:00", "05:00", "10:00", "15:00"];
    const setColor = ["yellow", "limegreen", "aquamarine", "dodgerblue", "violet"]
    const setID = ["b1", "b2", "b3", "b4", "b5"];
    const savedTexts = JSON.parse(localStorage.getItem("setBtnTexts") || "null");
    const setStrings = savedTexts || setStringsDefault;
    const fragmentSet = document.createDocumentFragment();
    for (let i = 0; i < setStrings.length; i++) {
        let setBtn = document.createElement('div');
        setBtn.classList.add("setBtnGroup");
        const stButton = document.createElement('button');
        stButton.style.backgroundColor = setColor[i];
        stButton.classList.add("setBtn");
        stButton.id = setID[i];
        stButton.textContent = setStrings[i];
        setBtn.appendChild(stButton);
        fragmentSet.appendChild(setBtn);
    }
    setButton.appendChild(fragmentSet);

    //アクションボタン５個を生成
    const actionStrings = ["ﾊﾞｰOFF", "♪" + audioString[audioNum], "設定", "リセット", "スタート"];
    const actionColor = ["lightgray", "lightgray", "gray", "red", "orange"];
    const actionID = ["progress", "sound", "setting", "reset", "start"];
    const fragmentAction = document.createDocumentFragment();
    for (let i = 0; i < actionStrings.length; i++) {
        let actionBtn = document.createElement('div');
        actionBtn.classList.add("actionBtnGroup");
        const actButton = document.createElement('button');
        actButton.textContent = actionStrings[i];
        actButton.style.backgroundColor = actionColor[i];
        actButton.classList.add("actionBtn");
        actButton.id = actionID[i];
        actionBtn.appendChild(actButton);
        fragmentAction.appendChild(actionBtn);
    }
    actionButton.appendChild(fragmentAction);

    //changeボタン20個を生成
    const changeStrings = ["△", "▽", "△", "▽", "△", "▽", "△", "▽", "△", "▽", "△", "▽", "△", "▽", "△", "▽", "△", "▽", "△", "▽"];
    const changeColor = ["gray", "gray", "lightgray", "lightgray", "gray", "gray", "lightgray", "lightgray", "gray", "gray", "lightgray", "lightgray", "gray", "gray", "lightgray", "lightgray", "gray", "gray", "lightgray", "lightgray"];
    const changeClass = ["b1", "b1", "b1", "b1", "b2", "b2", "b2", "b2", "b3", "b3", "b3", "b3", "b4", "b4", "b4", "b4", "b5", "b5", "b5", "b5"];
    const fragmentChange = document.createDocumentFragment();
    for (let i = 0; i < changeStrings.length; i++) {
        let changeBtn = document.createElement('div');
        changeBtn.classList.add("changeBtnGroup");
        const changeButton = document.createElement('button');
        changeButton.textContent = changeStrings[i];
        changeButton.style.backgroundColor = changeColor[i];
        changeButton.classList.add(changeClass[i]);
        changeBtn.appendChild(changeButton);
        fragmentChange.appendChild(changeBtn);
    }
    changeset.appendChild(fragmentChange);
    //一時的に非表示
    document.querySelectorAll('.b1, .b2, .b3, .b4, .b5').forEach(btn => {
        btn.classList.add('hidden');
    });

    // 文字列のサイズ調整
    function adjustFontSize(element) {
        const text = element.innerText || element.textContent; // 表示する文字
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let fontSize = 10; // 初期フォントサイズ
        element.style.fontSize = fontSize + "px";

        // 要素のサイズを取得
        const maxWidth = element.clientWidth;
        const maxHeight = element.clientHeight;

        // フォントサイズを徐々に大きくする
        while (true) {
            ctx.font = `${fontSize}px sans-serif`; // フォント設定
            const textWidth = ctx.measureText(text).width; // テキストの描画幅
            const textHeight = fontSize * 1.2; // 高さ（フォントの倍率を考慮）

            if (textWidth > maxWidth || textHeight > maxHeight) {
                fontSize -= 1; // 1px 小さくして調整
                break;
            }

            fontSize += 1; // まだ収まるなら大きくする
        }

        element.style.fontSize = `${fontSize}px`; // 最終的なサイズを適用
    }

    //ロード前にフォントサイズ調整を実行
    document.addEventListener("DOMContentLoaded", () => {
        AdjustStringSize(); // フォントサイズを調整
        document.body.classList.add("ready"); // 調整が終わってから表示
    });

    // 複数の要素に適用する
    function AdjustStringSize() {
        adjustFontSize(timer);
        const elements1 = document.querySelectorAll("[class*='Btn']");
        elements1.forEach(element => {
            adjustFontSize(element); // 各要素に対して調整
        });
        const elements4ClassName = ["b1", "b2", "b3", "b4", "b5"];
        for (let i = 0; i < elements4ClassName.length; i++) {
            const elements4 = document.querySelectorAll("." + elements4ClassName[i]);
            elements4.forEach(element => {
                adjustFontSize(element); // 各要素に対して調整
                console.log(element.fontSize);
            });
        }
        const actionButtons = document.querySelectorAll(".actionBtn");
        let minFontSize = Infinity;

        // 各action-buttonのフォントサイズを調べ、最小値を取得
        actionButtons.forEach(button => {
            const fontSize = parseFloat(window.getComputedStyle(button).fontSize);
            minFontSize = Math.min(minFontSize, fontSize);
        });

        // 取得した最小のフォントサイズをすべてのaction-buttonに適用
        actionButtons.forEach(button => {
            button.style.fontSize = `${minFontSize}px`;
        });
    }

    // ウィンドウサイズ変更時に調整
    window.addEventListener("resize", AdjustStringSize);
    window.addEventListener("load", AdjustStringSize);

    /////////ボタンイベント///////////////////////////////////////////////////////////////////////
    //DOM構築完了後のイベント
    document.addEventListener("DOMContentLoaded", () => {
        for (let i = 1; i <= 6; i++) {
            audioFiles.push(`audio/sound${i}.mp3`);
        }
        const start = document.getElementById("start");
        const reset = document.getElementById("reset");
        const audio = document.getElementById("sound");
        const progress = document.getElementById("progress");
        const setting = document.getElementById("setting");
        start.addEventListener("click", ClickStart);
        reset.addEventListener("click", ClickReset);
        audio.addEventListener("click", function () {
            ClickAudio(this);
        });
        progress.addEventListener("click", function () {
            ClickProgress(this);
        })
        const elements = document.querySelectorAll(".setBtn");
        elements.forEach(element => {
            element.addEventListener("click", () => ClickSet(element.textContent)); // 各要素に対して適用
        });
        const elements2 = document.querySelectorAll(".adjBtnM");
        elements2.forEach(element => {
            element.addEventListener("click", () => ClickAdjust(element.id)); // 各要素に対して適用
        });
        const elements3 = document.querySelectorAll(".adjBtnS");
        elements3.forEach(element => {
            element.addEventListener("click", () => ClickAdjust(element.id)); // 各要素に対して適用
        });
        const elements4ClassName = ["b1", "b2", "b3", "b4", "b5"];
        for (let i = 0; i < elements4ClassName.length; i++) {
            const elements4 = document.querySelectorAll("." + elements4ClassName[i]);
            elements4.forEach(element => {
                element.addEventListener("click", function () {
                    ClickChangeSet(this);
                })
            });
        }
        setting.addEventListener("click", ClickSetting);
    });

    //ミリ秒を分・秒に変換
    function timeToString(millis) {
        const totalSeconds = Math.floor(millis / 1000);
        const m = Math.floor(totalSeconds / 60);  // 分をそのまま取得
        const s = totalSeconds % 60;  // 秒はそのまま

        const formatedM = Math.min(m, 99).toString().padStart(2, '0'); // 99分まで
        const formatedS = s.toString().padStart(2, '0');

        return `${formatedM}:${formatedS}`;
    }

    //00:00文字列をミリ秒に変換
    function timeToMilliSec(timeString) {
        const [minutes, seconds] = timeString.split(":").map(Number);
        return (minutes * 60 + seconds) * 1000;
    }

    //スタートボタンをクリックしたときの処理
    function ClickStart() {
        if (start.textContent === "スタート") {
            start.textContent = "ストップ"
            const buttons = document.querySelectorAll(".setBtn");
            buttons.forEach(btn => {
                HideElement(btn, "hidden");
            })
            const buttons2 = document.querySelectorAll(".actionBtn");
            buttons2.forEach(btn => {
                if (btn.id !== "start") {
                    HideElement(btn, "hidden");
                }
            })
            const buttons3 = document.querySelectorAll(".adjBtnGroup");
            buttons3.forEach(btn => {
                HideElement(btn, "hidden");
            })
            if (timer.textContent === "00:00" || state === "countup") {
                state = "countup";

                let startMs = Date.now();   //開始時間ミリ秒
                startMs -= elapsedMs;

                timerID = setInterval(() => {
                    const nowMs = Date.now();
                    elapsedMs = nowMs - startMs;

                    timer.textContent = timeToString(elapsedMs);
                }, 1000);
            } else if (timer.textContent !== "00:00" || state === "countdown") {
                if (state !== "countdown") {
                    state = "countdown"
                    elapsedMs = timeToMilliSec(timer.textContent);
                    totalMs = elapsedMs
                };
                if (progress.textContent === "ﾊﾞｰON") {
                    HideElementByID("timer-bg", "visible");
                } else if (progress.textContent === "ﾊﾞｰOFF") {
                    if (!document.getElementById("timer-bg").classList.contains("hidden")) {
                        HideElementByID("timer-bg", "hidden");
                    }
                }
                let endMs = Date.now() + elapsedMs; // 残り時間を計算
                timerID = setInterval(() => {
                    elapsedMs = endMs - Date.now();
                    if (elapsedMs <= 0) {
                        clearInterval(timerID);
                        let alarm = new Audio(audioFiles[audioNum]);
                        alarm.play();
                        timer.textContent = "00:00";
                        updateTimerDisplay(0, totalMs);
                        elapsedMs = 0;
                        state = "start";
                        if (progress.textContent === "ﾊﾞｰON") {
                            HideElementByID("timer-bg", "hidden");
                        }
                        document.getElementById("timer-bg").style.width = "100%";
                        const buttons = document.querySelectorAll(".setBtn.hidden");
                        buttons.forEach(btn => {
                            HideElement(btn, "visible");
                        })
                        const buttons2 = document.querySelectorAll(".actionBtn.hidden");
                        buttons2.forEach(btn => {
                            HideElement(btn, "visible");
                        })
                        const buttons3 = document.querySelectorAll(".adjBtnGroup");
                        buttons3.forEach(btn => {
                            HideElement(btn, "visible");
                        })
                        return;
                    }
                    timer.textContent = timeToString(roundUpToNearestThousand(elapsedMs));
                    updateTimerDisplay(elapsedMs, totalMs);
                }, 1000);
            }
        } else if (start.textContent === "ストップ") {
            start.textContent = "スタート";
            clearInterval(timerID);
            const buttons = document.querySelectorAll(".actionBtn.hidden");
            buttons.forEach(btn => {
                HideElement(btn, "visible");
            })
        }
    }

    //リセットボタンをクリックしたときの処理
    function ClickReset() {
        const buttons = document.querySelectorAll(".setBtn.hidden");
        buttons.forEach(btn => {
            HideElement(btn, "visible");
        })
        const buttons2 = document.querySelectorAll(".actionBtn.hidden");
        buttons2.forEach(btn => {
            HideElement(btn, "visible");
        })
        const buttons3 = document.querySelectorAll(".adjBtnGroup");
        buttons3.forEach(btn => {
            HideElement(btn, "visible");
        })
        if (!document.getElementById("timer-bg").classList.contains("hidden")) {
            HideElementByID("timer-bg", "hidden");
        }
        document.getElementById("timer-bg").style.width = "100%";
        state = "start";
        clearInterval(timerID);
        start.textContent = "スタート";
        elapsedMs = 0;
        timer.textContent = "00:00";
    }

    //セットボタンをクリックしたときの処理
    function ClickSet(timeText) {
        state = "countdown";
        start.textContent = "ストップ";
        if (progress.textContent === "ﾊﾞｰON") {
            HideElementByID("timer-bg", "visible");
        }
        const buttons = document.querySelectorAll(".setBtn");
        buttons.forEach(btn => {
            HideElement(btn, "hidden");
        })
        const buttons2 = document.querySelectorAll(".actionBtn");
        buttons2.forEach(btn => {
            if (btn.id !== "start") {
                HideElement(btn, "hidden");
            }
        })
        const buttons3 = document.querySelectorAll(".adjBtnGroup");
        buttons3.forEach(btn => {
            HideElement(btn, "hidden");
        })

        let endMs = Date.now();
        endMs += timeToMilliSec(timeText);
        clearInterval(timerID); // タイマーをリセット
        timer.textContent = timeText;
        elapsedMs = endMs - Date.now();
        totalMs = elapsedMs;

        timerID = setInterval(() => {
            const nowMs = Date.now();
            elapsedMs = endMs - nowMs;

            if (elapsedMs <= 0) {
                clearInterval(timerID);
                let alarm = new Audio(audioFiles[audioNum]);
                alarm.play();
                timer.textContent = "00:00";
                updateTimerDisplay(0, totalMs);
                start.textContent = "スタート";
                elapsedMs = 0;
                state = "start";
                if (progress.textContent === "ﾊﾞｰON") {
                    HideElementByID("timer-bg", "hidden");
                }
                document.getElementById("timer-bg").style.width = "100%";
                const buttons = document.querySelectorAll(".setBtn.hidden");
                buttons.forEach(btn => {
                    HideElement(btn, "visible");
                })
                const buttons2 = document.querySelectorAll(".actionBtn.hidden");
                buttons2.forEach(btn => {
                    HideElement(btn, "visible");
                })
                const buttons3 = document.querySelectorAll(".adjBtnGroup");
                buttons3.forEach(btn => {
                    HideElement(btn, "visible");
                })
                return;
            }
            timer.textContent = timeToString(roundUpToNearestThousand(elapsedMs));
            updateTimerDisplay(elapsedMs, totalMs);
        }, 1000);
    }

    //最も近い1000の倍数に切り上げる処理
    function roundUpToNearestThousand(num) {
        return Math.ceil(num / 1000) * 1000;
    }

    //IDによって要素の表示を変更する
    function HideElementByID(id, isHidden) {
        if (isHidden === "hidden") {
            document.getElementById(id).classList.add("hidden");
        } else if (isHidden === "visible") {
            document.getElementById(id).classList.remove("hidden");
        }
    }

    //要素の表示切り替え
    function HideElement(element, isHidden) {
        if (isHidden === "hidden") {
            element.classList.add("hidden");
        } else if (isHidden === "visible") {
            element.classList.remove("hidden");
        }
    }

    //AudioButtonの動作
    function ClickAudio(Btn) {
        if (audioNum < 5) {
            audioNum++;
        } else {
            audioNum = 0;
        }
        Btn.textContent = "♪" + audioString[audioNum];
    }

    //AdjustButtonの動作
    function ClickAdjust(id) {
        let msec = timeToMilliSec(timer.textContent);
        let plus = Number(id.slice(1));

        if (id.includes("m")) {
            plus *= 1000 * 60;
        } else if (id.includes("s")) {
            plus *= 1000;
        }

        msec += plus;
        // 99:99 (5999秒) を超えないようにする
        if (msec > 5999000) {
            msec = 5999000;
        }

        timer.textContent = timeToString(msec);
    }

    //プログレスバーの更新
    function updateTimerDisplay(remainingMs, totalMs) {
        // 背景の幅を計算（% ベース）
        let widthPercent = (remainingMs / totalMs) * 100;
        document.getElementById("timer-bg").style.width = widthPercent + "%";
    }

    //プログレスボタンの処理
    function ClickProgress(Btn) {
        if (Btn.textContent === "ﾊﾞｰON") {
            Btn.textContent = "ﾊﾞｰOFF";
        } else if (Btn.textContent === "ﾊﾞｰOFF") {
            Btn.textContent = "ﾊﾞｰON";
        }
    }

    //change-setボタンの処理
    function ClickChangeSet(Btn) {
        const targetSet = document.getElementById(Btn.classList[0]);
        const BtnColor = getComputedStyle(Btn).backgroundColor;
        let tmpTime = timeToMilliSec(targetSet.textContent);
        if (Btn.textContent === "△") {
            //1.lightgrayなら 2.grayなら
            if (BtnColor === "rgb(211, 211, 211)") {
                tmpTime += 1000;
            } else if (BtnColor === "rgb(128, 128, 128)") {
                tmpTime += (60 * 1000);
            }
        } else if (Btn.textContent === "▽") {
            //1.lightgrayなら 2.grayなら
            if (BtnColor === "rgb(211, 211, 211)") {
                tmpTime -= 1000;
            } else if (BtnColor === "rgb(128, 128, 128)") {
                tmpTime -= (60 * 1000);
            }
        }
        if (tmpTime < 1000) {
            tmpTime = 1000;
        } else if (tmpTime > 5999000) {
            tmpTime = 5999000;
        }
        targetSet.textContent = timeToString(tmpTime);
    }

    //settingボタンの処理
    function ClickSetting() {
        if (setting.textContent === "設定") {
            //「設定」→「設定完了」に変更し、20個のボタンを表示（それ以外は非表示）
            document.querySelectorAll('.b1, .b2, .b3, .b4, .b5').forEach(btn => {
                btn.classList.remove('hidden');
            });
            document.querySelectorAll('.actionBtn, .adjBtnGroup').forEach(btn => {
                if (btn.textContent !== "設定") {
                    btn.classList.add('hidden');
                }
            });
            document.querySelectorAll('.setBtn').forEach(btn => {
                btn.disabled = true;
            });
            timer.classList.add('hidden');
            setting.textContent = "保存";
            setting.style.backgroundColor = "red"
        } else if (setting.textContent === "保存") {
            //「設定完了」→「設定」に変更し、20個のボタンを非表示（それ以外を表示）
            document.querySelectorAll('.b1, .b2, .b3, .b4, .b5').forEach(btn => {
                btn.classList.add('hidden');
            });
            document.querySelectorAll('.actionBtn, .adjBtnGroup').forEach(btn => {
                if (btn.textContent !== "保存") {
                    btn.classList.remove('hidden');
                }
            });
            document.querySelectorAll('.setBtn').forEach(btn => {
                btn.disabled = false;
            });
            timer.classList.remove('hidden');
            setting.textContent = "設定";
            setting.style.backgroundColor = "gray"
            // ＋ 現在の状態を記録
            const setButtons = document.querySelectorAll('.setBtn');
            const texts = Array.from(setButtons).map(btn => btn.textContent);
            localStorage.setItem("setBtnTexts", JSON.stringify(texts));
        }
    }
}