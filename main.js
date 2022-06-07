const text = `
<code class="language-php hljs"><span class="hljs-keyword">require_once</span> <span class="hljs-string">'Zend/Uri/Http.php'</span>;

<span class="hljs-keyword">namespace</span> <span class="hljs-title class_">Location</span>\<span class="hljs-title class_">Web</span>;

<span class="hljs-class"><span class="hljs-keyword">interface</span> <span class="hljs-title">Factory</span>
</span>{
    <span class="hljs-built_in">static</span> <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">_factory</span>(<span class="hljs-params"></span>)</span>;
}

<span class="hljs-keyword">abstract</span> <span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">URI</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">BaseURI</span> <span class="hljs-keyword">implements</span> <span class="hljs-title">Factory</span>
</span>{
    <span class="hljs-keyword">abstract</span> <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">test</span>(<span class="hljs-params"></span>)</span>;

    <span class="hljs-keyword">public</span> <span class="hljs-built_in">static</span> <span class="hljs-variable">$st1</span> = <span class="hljs-number">1</span>;
    <span class="hljs-keyword">const</span> <span class="hljs-variable constant_">ME</span> = <span class="hljs-string">"Yo"</span>;
    <span class="hljs-keyword">var</span> <span class="hljs-variable">$list</span> = <span class="hljs-literal">NULL</span>;
    <span class="hljs-keyword">private</span> <span class="hljs-variable">$var</span>;

    <span class="hljs-comment">/**
     * Returns a URI



     * <span class="hljs-doctag">@return</span> URI
     */</span>
    <span class="hljs-built_in">static</span> <span class="hljs-keyword">public</span> <span class="hljs-function"><span class="hljs-keyword">function</span> <span class="hljs-title">_factory</span>(<span class="hljs-params"><span class="hljs-variable">$stats</span> = <span class="hljs-keyword">array</span>(<span class="hljs-params"></span>), <span class="hljs-variable">$uri</span> = <span class="hljs-string">'http'</span></span>)
    </span>{
        <span class="hljs-keyword">echo</span> <span class="hljs-keyword">__METHOD__</span>;
        <span class="hljs-variable">$uri</span> = <span class="hljs-title function_ invoke__">explode</span>(<span class="hljs-string">':'</span>, <span class="hljs-variable">$uri</span>, <span class="hljs-number">0b10</span>);
        <span class="hljs-variable">$schemeSpecific</span> = <span class="hljs-keyword">isset</span>(<span class="hljs-variable">$uri</span>[<span class="hljs-number">1</span>]) ? <span class="hljs-variable">$uri</span>[<span class="hljs-number">1</span>] : <span class="hljs-string">''</span>;
        <span class="hljs-variable">$desc</span> = <span class="hljs-string">'Multi
line description'</span>;

        <span class="hljs-comment">// Security check</span>
        <span class="hljs-keyword">if</span> (!<span class="hljs-title function_ invoke__">ctype_alnum</span>(<span class="hljs-variable">$scheme</span>)) {
            <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Zend_Uri_Exception</span>(<span class="hljs-string">'Illegal scheme'</span>);
        }

        <span class="hljs-variable language_">$this</span>-&gt;<span class="hljs-keyword">var</span> = <span class="hljs-number">0</span> - <span class="hljs-built_in">self</span>::<span class="hljs-variable">$st</span>;
        <span class="hljs-variable language_">$this</span>-&gt;<span class="hljs-keyword">list</span> = <span class="hljs-keyword">list</span>(<span class="hljs-title function_ invoke__">Array</span>(<span class="hljs-string">"1"</span>=&gt; <span class="hljs-number">2</span>, <span class="hljs-number">2</span>=&gt;<span class="hljs-built_in">self</span>::<span class="hljs-variable constant_">ME</span>, <span class="hljs-number">3</span> =&gt; \Location\Web\URI::<span class="hljs-variable language_">class</span>));

        <span class="hljs-keyword">return</span> [
            <span class="hljs-string">'uri'</span>   =&gt; <span class="hljs-variable">$uri</span>,
            <span class="hljs-string">'value'</span> =&gt; <span class="hljs-literal">null</span>,
        ];
    }
}

<span class="hljs-keyword">match</span> (<span class="hljs-variable">$key</span>) {
    <span class="hljs-number">1</span> =&gt; <span class="hljs-string">'Integer 1'</span>,
    <span class="hljs-string">'1'</span> =&gt; <span class="hljs-string">'String 1'</span>,
    <span class="hljs-literal">true</span> =&gt; <span class="hljs-string">'Bool true'</span>,
    [] =&gt; <span class="hljs-string">'Empty array'</span>,
    [<span class="hljs-number">1</span>] =&gt; <span class="hljs-string">'Array [1]'</span>,
};

<span class="hljs-class"><span class="hljs-keyword">enum</span> <span class="hljs-title">Foo</span>: <span class="hljs-title">string</span> </span>{
    <span class="hljs-keyword">case</span> Test = <span class="hljs-string">'test'</span>;
}

<span class="hljs-keyword">echo</span> URI::<span class="hljs-variable constant_">ME</span> . URI::<span class="hljs-variable">$st1</span>;

<span class="hljs-title function_ invoke__">__halt_compiler</span> () ; datahere
datahere
datahere */
datahere
</code>
`.trim();

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
		html += `<div class='code-line'>${line || "<br>"}</div>\n`;
	}

	return lines;
}

const s = `
<span class="hljs-comment">/**
* Returns a URI
*


* <span class="hljs-doctag">@return</span> URI
*/</span>

x
`;

const output = transform(s);

console.log(output);
