'use strict'

{
    const buttons = document.getElementById("buttons");

    const url = [
        "SimpleTimer/index.html",
        "CalcCard/index.html",
        "Multiplication-App/index.html",
        "SimulatorDivisionCalcByWritten/index.html"
    ];

    const aText = [
        "タイマー",
        "けいさんカード",
        "かけ算カード",
        "わり算の筆算"
    ];

    const aClass = [
        "aWhite",
        "aBlack",
        "aWhite",
        "aBlack"
    ];

    // ボタン生成
    for (let i = 0; i < url.length; i++) {
        const a = document.createElement("a");

        a.id = "a" + i.toString();
        a.className = "a";
        a.classList.add(aClass[i % 2]);
        a.href = url[i];
        a.textContent = aText[i];

        buttons.appendChild(a);
    }

    // =========================================================
    // 文字サイズ調整
    // ボタンのサイズ・配置は変更せず、
    // 文字だけを1行で収まるように調整する
    // =========================================================
    function fitText(element) {
        if (!element) return;

        const text = element.textContent.trim();
        if (!text) return;

        // CSSで指定した初期サイズに戻す
        element.style.fontSize = "";

        const style = getComputedStyle(element);

        const paddingLeft = parseFloat(style.paddingLeft) || 0;
        const paddingRight = parseFloat(style.paddingRight) || 0;

        const maxWidth = Math.max(
            1,
            element.clientWidth - paddingLeft - paddingRight
        );

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const fontStyle = style.fontStyle;
        const fontWeight = style.fontWeight;
        const fontFamily = style.fontFamily;

        function fits(fontSize) {
            ctx.font =
                `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

            const textWidth = ctx.measureText(text).width;

            return textWidth <= maxWidth;
        }

        // 現在のCSSサイズ
        const baseSize = parseFloat(style.fontSize);

        if (!Number.isFinite(baseSize) || baseSize <= 0) {
            return;
        }

        // まず現在のサイズで収まるなら、そのまま
        if (fits(baseSize)) {
            return;
        }

        // 収まらない場合だけ縮小する
        let low = 8;
        let high = baseSize;

        for (let i = 0; i < 20; i++) {
            const mid = (low + high) / 2;

            if (fits(mid)) {
                low = mid;
            } else {
                high = mid;
            }
        }

        element.style.fontSize = `${Math.floor(low)}px`;
    }

    function adjustAllButtonText() {
        document.querySelectorAll(".a").forEach(element => {
            fitText(element);
        });
    }

    // 初期表示
    document.addEventListener("DOMContentLoaded", () => {
        adjustAllButtonText();
    });

    // 画面サイズ変更時
    window.addEventListener("resize", adjustAllButtonText);

    // 完全読み込み後にも調整
    window.addEventListener("load", adjustAllButtonText);
}
