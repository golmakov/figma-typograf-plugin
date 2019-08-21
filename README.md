# Typograf plugin for Figma

Figma plugin for making good typographic text.

* Removes hanging conjunctions.
* Connects the number and the unit with non-breaking space.
* Puts right quotes “outside and ‘inside’ proposals” instead programmers “ " ”.
* Removes double-spaces, double-enters, double-dots and other trash, but leaves * ellipsis.
* Makes ©, ®, ™ from (c), -- turns to — , -> transforms to →, makes ≠ from !=, mm3 turns to mm³.
* Divides 5-digit numbers or more, like 15 800.
* Removes spaces at $50 and puts non-breaking spaces at 100 % or 50 €.
* And a little more.

It's based on the [Typograf JS](https://github.com/typograf/typograf) library.

## Install instructions

[Download the ZIP file](https://github.com/golmakov/figma-typograf-plugin/releases/download/v1.0.0/figma-typograf-plugin.zip) and extract contents.

Open the Figma Desktop, select `Plugins` click `Create your own plugin` -> `Click to choose a manifest.json file` and find the `manifest.json` file in the plugin directory.

## Development

First clone this repository

```bash
git clone https://github.com/golmakov/figma-typograf-plugin.git
cd figma-typograf-plugin
```

Install dependencies & build files

```bash
npm install
npm run dev
```