'use strict'
{
    const buttons = document.getElementById("buttons");
    const url = ["SimpleTimer/index.html", "CalcCard/index.html"];
    const aText = ["タイマー", "けいさんカード"];
    const aClass = ["aWhite", "aBlack"];
    for (let i = 0; i < url.length; i++) {
        const a = document.createElement("a");
        a.id = "a" + i.toString();
        a.className = "a";
        a.classList.add(aClass[i % 2]);
        a.href = url[i];
        a.textContent = aText[i];
        buttons.appendChild(a);
    }

    function clickBtn() {

    }
}