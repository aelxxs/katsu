const { init, component } = Lucia;

const grower = document.querySelector(".editor");
const editor = document.querySelector("textarea");

const app = component({
	html: "",
	code: "",
	raw: "",
	make() {
		this.code = "";
		this.html = "";
		window.history.pushState(null, "", "/");
	},
	edit() {
		this.html = "";
		grower.dataset.raw = this.code;
		window.history.pushState(null, "", "/");
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

			grower.dataset.raw = "";
			this.html = hljs.highlightAuto(this.code).value;
			window.history.pushState(null, "", `/${id}`);
		} catch {
			this.make();
		}
	},
});

editor.addEventListener("input", () => {
	grower.dataset.raw = editor.value;
});

editor.addEventListener("keydown", (event) => {
	if (event.key === "Tab") {
		event.preventDefault();

		let start = document.selectionStart,
			end = document.selectionEnd;

		app.state.code = app.state.code.substring(0, start) + "\t" + app.state.code.substring(end);

		document.selectionStart = document.selectionEnd = start + 1;
	}
});

async function onPop() {
	const path = window.location.pathname;

	if (path === "/") {
		return app.state.make();
	}

	const [, first] = path.split("/");
	const [id, language] = first.split(".");

	try {
		const res = await fetch(`/api/doc/${id}`, {
			method: "GET",
		});

		const { doc } = await res.json();

		app.state.code = doc;

		try {
			app.state.html = (language ? hljs.highlight(doc, { language }) : hljs.highlightAuto(doc)).value;
		} catch {
			app.state.html = hljs.highlightAuto(doc).value;
		}
	} catch {
		window.history.pushState(null, "", `/`);
		app.state.make();
	}
}

window.addEventListener("popstate", onPop);
window.addEventListener("DOMContentLoaded", onPop);

app.mount("#app");
