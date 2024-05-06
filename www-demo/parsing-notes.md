# Parsing Notes
Looking at the [perl code](https://github.com/wikimedia/mediawiki-extensions-timeline/blob/master/scripts/EasyTimeline.pl), the file is 5337 lines long.
We're only looking for parts relevant to option parsing though, so it shouldn't be a long search.

Line 370 has fn/sub `ParseScript`, this looks like what we want. Line 383 I see a while loop, which terminates
once $InputParse is set to true. I'm very unfamiliar with perl syntax; I'm guess `&GetCommand;` is a subroutine
call? There's global and local variables, `$Command` is global I think. Not sure what `=~` is.

There are error messages, `&Error("Invalid statement...")`, these will be helpful in understanding what's going on.
Looks like the parsing logic is split between this `sub ParseScript`, the `sub GetCommand` is on line 585...
but it looks like there's more layers;

I'm going to create a rough "call graph" or more of a list below

- `ParseScript` lines 370 to 516
- `GetLine` lines 518 to 583
- `GetCommand` lines 585 to 608

I'll have to invest some time translating this to JS I think. The translation process will help me
comprehend the general procedure/algorithm logic, and also produce code that can run in a language
runtime relevant to this project. right now just charting the path forward is enough.
