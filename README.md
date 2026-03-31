# DOCme-website

### Build Setup

##### Install dependencies
`$ npm install`

##### Use the recommended Node version
`$ nvm use`

##### Configure environment variables

Copy the file `.env.local.example` to a new file named `.env.local` and then edit it with the environment specific settings. This new file will be ignored by Git (don't need to ever commit).
The variables you will need are:

- API base URL
- App base URL
- Google API key (for geocoding)
- AWS access key ID
- AWS access key secret
- Stripe public key
- Stripe product ID

Optional variables:

- Stripe success URL override
- Stripe cancelled URL override

Most domain changes can now be handled by updating `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_APP_BASE_URL` in one place.
    
##### Serve with hot reload at localhost:3000
`$ npm run dev`

### Deployment

##### Build for production and launch server
`$ npm run build`  

Then you''ll have a static version of your app in the 'out' directory.  
For detailed explanation on how things work, check out [Next.js static HTML export docs](https://nextjs.org/docs/advanced-features/static-html-export).
