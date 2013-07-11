<div class="radio-group">
	{{#radios}}
	<div id="radio-{{id}}" class="radio {{#checked}}active{{\checked}}">{{&label}}</div>
	{{/radios}}
	<div style="display:none">{{&html}}</div>
</div>