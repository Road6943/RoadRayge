# Advanced Filtering
The simplest way to filter is to just type a search into the textbox. This will only show themes whose name or author or tags contain your search query.

There are also advanced filtering options to more precisely control what is filtered.

## Special Operators
Firstly, you can special operators to match a certain criteria on a certain theme detail. For the examples below, `a` can be one of `name`/`author`/`tags` while `b` is anything you want to search for. `b` can contain whitespace - for example, you can search for `dark theme`.

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
