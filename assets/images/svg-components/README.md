# SVG Components
SVGs that are used as React imports and therefore inlined.  The `fixSVGs` script ignores these files when it runs its checks (through `check-svgs`) since SVGO will be taking care of most of the necessary post-processing.  Also `fixSVGs` does some unnecessary post-processing that's more relevant to embedding.  

See [Slack thread](https://aops.slack.com/archives/C012QLJTW2D/p1755652716209559) for more information on why `fixSVGs` exists.

If it comes to pass that we still need the viewport fix or what-have-yous we can figure something out.  But I _think_ FireFox has its SVG rendering together, at least.  It's been long enough.