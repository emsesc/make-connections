# Make some Connections!

> Do you and your loved one (family, friend, partner, etc.) play Connections together every day? Surrpise them for a birthday, anniversary, or just for funsies with this New York Times Connections dupe. **When they successfully solve your custom Connections puzzle, it leads them to a ["Tiny Love Stories"](https://www.nytimes.com/2025/11/05/style/tiny-modern-love-stories-the-moment-i-remember-most.html) article...written by you!** How cute.

## How hard is it?
1. Fork this repo
2. Add your custom messages and a photo
3. Deploy it to Vercel
4. Surprise them. Booooooom.

## Getting started

```bash
yarn install
yarn dev
```

Open the local URL Vite prints in your terminal.

## Customize to the MAX
> (or not)

Everything you need to edit (unless you're extra) lives in `src/constants.ts`. Update that file to change:

- the date, issue number, and who the puzzle is "by"
- the popup title/body/button label
- the Modern Love title, article title, body, author, and image caption
- the daily Connections group names and items in `DAY_1`

Also, don't forget to add a picture in `public/`. You can specify the image name you choose in the `src/constants.ts` file.

If you want to change the home screen or game UI text, check the matching components in `src/components/`.

## Build locally

Yeah... so make sure this thing actually works before you prank them. That's important.
```bash
yarn build
```

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import the repository in Vercel.
3. Let Vercel use the default build settings, or set them manually to:
   - **Build Command:** `yarn build`
   - **Output Directory:** `dist`
4. Deploy.

`vercel.json` already includes the static build configuration and SPA fallback routing.

## Credits

*Connections UI credit goes to [dbousamra](https://github.com/dbousamra/connections).*
*Modern Love dupe credits goes to [CyberCelibate](https://www.cybercelibate.com/p/the-anti-gift-guide?utm_source=publication-search).*
