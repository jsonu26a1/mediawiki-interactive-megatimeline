function parse_wikitext_v0(text) {
  // DEPRECATED; oops, we should not use indexOf everywhere;
  // since that will skip over stuff we might need to handle
  // the parsing will be a little bit more complicated than we thought
  // but this code can still be a good reference as we tackle this task
  let r_sp = / +/;
  let i = 0;
  function find_next(part, errmsg) {
    let i2 = text.indexOf(part, i);
    if(i2 == -1) {
      throw {pos: i, part, errmsg};
    }
    i = i2 + part.length;
    return i;
  }
  // we only care about parsing templates
  find_next("{{", "template start");
  find_next("#tag:timeline", "timeline tag");
  find_next("|", "parameter separator");
  // note; line 7 of sample has recursively embedded {{#time:...}} template
}

class WtParser {
  constructor(text) {
    this.text = text;
    this.i = 0;
  }
  skip(r) {
    let part = this.text.substring(this.i);
    let a = r.exec(part);
    if(a != null) {
      this.i += a[0].length;
    }
  }
  match(r) {
    let part = this.text.substring(this.i);
    let a = r.exec(part);
    if(a == null) {
      throw {pos: this.i, text: this.text, re: r};
    }
    this.i += a[0].length;
    return a[0];
  }
}

// from https://www.mediawiki.org/wiki/Extension:EasyTimeline/syntax#Available_commands
let tl_commands = {
  layout: ["ImageSize", "PlotArea", "Colors", "BackgroundColors", "AlignBars"],
  presentation: ["DateFormat", "Period", "ScaleMajor", "ScaleMinor", "TimeAxis"],
  scipt_code: ["Define"],
  groups: ["BarData", "Legend", "LineData"],
  events: ["PlotData", "TextData"],
}
let tl_all_commands = [];
for(const prop in tl_commands) {
  tl_all_commands.push(...tl_commands[prop]);
}

function parse_wikitext_v1(text) {
  // just some comments of the general process/steps to implement for parsing
  // find `{{` template opening/start
  // if template is `#tag:timline`, proceed parsing, else skip to `}}` template close/end

  // parsing logic for template-tag attributes (see https://www.mediawiki.org/wiki/Help:Magic_words#Miscellaneous )
  // it appears to be `AttributeName = value`, but it's a little more complicated
  // since attrs might be a single line (the new line being the seperator for the next attr),
  // or the attr might span multiple lines, with a new line right after the `=` signifying many
  // lines with attribute values, with a double empty line (see lines 12,24,26,35,64, etc)
  // signifying a "seperator" for the next attr.

  // I'm still not sure what all the attribute values mean, the structure of PlotData and Colors
  // reminds me of some sort of table-like data structure? this parser will just create a flat list
  // of `key:value` items in an array to be handled later; parse_wikitext will just return a POJO
  // after the parser is mostly working, we will work on transforming the POJO and work on a mockup
  // for visualizing the data in the timeline template. see resources for original perl impl
  let r_sp = / +/;
  let r_ws = /\w*/;
  let parser = new WtParser(text);
  parser.skip(/[^\{]*/);
  parser.match(/\{\{/);
  // TODO: we SHOULD handle non-timeline templates here, this is temporary
  parser.match(/#tag:timline\|/);
  // looking at Extension:EasyTimeline/syntax link, I'm not sure how Commands are distinguished
  // from attributes; it could be just hard-coded in, let's try doing that (see tl_all_commands)
  parser.skip(r_ws);
  // identifier?
  parser.match(/[A-Za-z]+/);
  // looking at https://www.mediawiki.org/wiki/Extension:EasyTimeline/syntax#Commands
  // it appears the parsing of attributes can vary based on the command chosen?
  // this is a little more complex than I anticipated, but not impossible. might need
  // to mess around with the syntax in a mediawiki sandbox to see what's valid or not
  // also take a look at how the perl script does parsing may help.
}

fetch("data/sample-queen-wikitext.txt").then((res) => {
  console.log(res);
  res.text().then(txt => parse_wikitext(txt));
});
