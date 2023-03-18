This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## xNFT Simulator

`npx xnft --iframe http://localhost:3000`

## Localnet game SDK setup

- Follow SETUP.md in `dominari-kyogen` to build the SDK and run the game
- run `yarn link` from `dominari-kyogen/kyogen-sdk/kyogen-sdk-web`
- run `yarn link "kyogen-sdk"` from root directory of `kyogen-xnft`
- add the following to a `.env.local` file (note the values should match the `.env` or `.env.local` values from `dominari-kyogen`)

```
NEXT_PUBLIC_COREDS_ID=GN5Ww5qa8ej4evFCJxMhV6AFEPKhD1Drdu8qYYptVgDJ
NEXT_PUBLIC_REGISTRY_ID=7Vpu3mY18uA2iWBhAyKc72F9xs1SaMByV5KaPpuLhFQz
NEXT_PUBLIC_KYOGEN_ID=CTQCiB97LrAjAtHy1eqGwqGiy2mjefBXR762nrDhWYTL
NEXT_PUBLIC_STRUCTURES_ID=4Bo4cgr4RhGpXJsQUV4KENCf3HJwPveFsPELJGGN9GkR
```
