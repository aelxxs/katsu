const URL_REGEX = /\/([\w]*)\.?(\w*)?\#?(L[\d]*[\-?L[\d]*]?)?/;

const { component } = Lucia;

const editor = document.querySelector("textarea");

const app = component({
	html: "",
	code: "",
	hash: {
		l1: null,
		l2: null,
	},
	make() {
		this.code = "";
		this.html = "";
		window.history.pushState({}, "", "/");
	},
	edit() {
		this.html = "";
		window.history.pushState({}, "", "/");
	},
	async save() {
		if (this.code.trim() == "") {
			return;
		}

		try {
			const res = await fetch("/api/doc", {
				method: "POST",
				body: this.code.trim(),
			});

			const { id } = await res.json();
			const { value } = hljs.highlightAuto(this.code);

			this.html = transform(value);
			window.history.pushState(null, "", `/${id}`);
		} catch {
			this.make();
		}
	},
	select(event, ln) {
		if (!this.html) return;

		if (event.shiftKey) {
			if (this.hash.l1 && ln > this.hash.l1) {
				this.hash.l2 = ln;
				window.history.pushState({}, "", `#L${this.hash.l1}-L${ln}`);
			} else if (this.hash.l1 && ln < this.hash.l1) {
				this.hash.l2 = this.hash.l1;
				this.hash.l1 = ln;
				window.history.pushState({}, "", `#L${ln}-L${this.hash.l2}`);
			} else {
				this.hash.l1 = ln;
				window.history.pushState({}, "", `#L${ln}`);
			}
		} else {
			this.hash.l1 = ln;
			this.hash.l2 = null;
			window.history.pushState({}, "", `#L${ln}`);
		}

		hljs.highlightLines(document.querySelector("code"), {
			start: this.hash.l1,
			end: this.hash.l2 || this.hash.l1,
		});
	},
});

function transform(text) {
	const openTags = [];

	const lines = text.replace(/(<span [^>]+>)|(<\/span>)|(\n)/g, (match) => {
		if (match === "\n") {
			return "</span>".repeat(openTags.length) + "\n" + openTags.join("");
		}

		if (match === "</span>") {
			openTags.pop();
		} else {
			openTags.push(match);
		}

		return match;
	});

	let html = "";

	// ! THIS DOESN'T ALWAYS WORK HELP
	for (const line of lines.split(/\n/)) {
		html += `<div class='code-line'>${line || "<br>"}</div>`;
	}

	return html;
}

editor.addEventListener("keydown", (event) => {
	if (event.key === "Tab") {
		event.preventDefault();

		let start = editor.selectionStart,
			end = editor.selectionEnd;

		app.state.code = app.state.code.substring(0, start) + "\t" + app.state.code.substring(end);

		editor.selectionStart = editor.selectionEnd = start + 1;
	}
});

async function onPop() {
	const urlPath = window.location.pathname;
	const urlHash = window.location.hash;

	if (urlPath === "/") {
		return app.state.make();
	}

	const [, id, language, hash] = URL_REGEX.exec(urlPath + urlHash);

	try {
		const res = await fetch(`/api/doc/${id}`, {
			method: "GET",
		});

		const { doc } = await res.json();

		app.state.code = doc;

		try {
			if (language) {
				const { value } = hljs.highlight(doc, { language });

				app.state.html = transform(value);
			} else {
				const { value } = hljs.highlightAuto(doc);

				app.state.html = transform(value);
			}
		} catch (error) {
			console.log({ error });
			const { value } = hljs.highlightAuto(doc);

			app.state.html = transform(value);
		}

		if (hash) {
			const [l1, l2] = hash.split(/\-/);

			hljs.highlightLines(document.querySelector("code"), {
				start: +l1.substring(1),
				end: +l2?.substring(1) || +l1.substring(1),
			});

			document.getElementById(l1)?.scrollIntoView({
				behavior: "smooth",
			});
		}
	} catch (error) {
		window.history.pushState(null, "", `/`);
		app.state.make();
	}
}

window.addEventListener("popstate", onPop);
window.addEventListener("DOMContentLoaded", onPop);

app.mount("#app");
