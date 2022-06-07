(function (w, d) {
	"use strict";

	if (w.hljs) {
		w.hljs.highlightLines = highlightLines;
	}

	function highlightLines(code, area) {
		const start = --area.start;
		const end = --area.end;

		const lines = code.getElementsByClassName("line");

		console.log(lines);
		if (start < 0 || end > lines.length) return;

		for (const line of lines) {
			line.classList.remove("highlighted");
		}

		for (let i = start; i <= end; ++i) {
			lines[i].classList.add("highlighted");
		}
	}
})(window, document);
