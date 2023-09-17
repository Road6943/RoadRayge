# Advanced Filtering
The simplest way to filter is to just type a search into the textbox. This will only show themes whose name or author or tags contain your search query.

There are also advanced filtering options to more precisely control what is filtered.

## Special Operators
Firstly, you can special operators to match a certain criteria on a certain theme detail. For the examples below, `a` can be one of the theme details properties -  `name`/`author`/`tags`. `b` is anything you want to search for and can contain whitespace - for example, you can search for `dark theme`.

The special operators are:
* Contains: `a~~b` will match when `a` contains `b`.
* Equals `a==b` will match when `a` is identical to `b`

For all special operators above, there is an opposite counterpart starting with a `!`. For example, `a!~~b` will match when `a` does NOT contain `b` and `a!==b` will match when `a` is NOT identical to `b`.

***All*** special operators are case-insensitive. `author==road` will match a theme with author `Road`.

## AND/OR Logic
You can search for multiple simultaneous conditions using AND/OR logic. For the examples below, `c` and `d` and `e` are individual conditions such as `light theme` or `name~~dark`.

If you separate conditions with a `,` then only themes that meet ALL the conditions will match. `c, d, e` will only match themes that match `c` AND match `d` AND match `e`.

If you separate conditions with a `|` then themes that meet ANY of the conditions will match. `c | d | e` will match themes that match one of the conditions `c`/`d`/`e`.

AND logic is evaluated first (higher precedence) before OR logic. This means that `c|d,e` matches themes that match `c` + also matches themes that match both `d` AND `e`. In Python this is `c or (d and e)`.

## Example
Consider this search: `author!==road, tags~~dark theme | light, very cool | tags!~~futuristic, tags!~~outer space, retro`.

This would match all themes that meet ***at least one*** of the following criteria. Remember that the theme details properties are the theme's name/author/tags:
* Theme's author is not exactly `road` AND theme has `dark theme` in its tags
  * If the author was `road2100k` then it would still match this criterion because we're using the Equals operator for name not the Contains operator
* Theme contains BOTH `light` AND `very cool` among its theme details propeties. For example a theme with name `Light Theme` and tag `Very Cool` would match this criterion
  * Remember that all operators are case-insensitive so `Very Cool` and `very cool` are considered matches
* Theme's tags doesn't contain `futuristic` AND theme's tags doesn't contain `outer space` AND theme contains `retro` among its theme details properties
