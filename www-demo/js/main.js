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
}

fetch("data/sample-queen-wikitext.txt").then((res) => {
  console.log(res);
  res.text().then(txt => parse_wikitext(txt));
});
