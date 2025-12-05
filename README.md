# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/31538f10-4cbd-465a-aad1-c4c2afb8b485

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/31538f10-4cbd-465a-aad1-c4c2afb8b485) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/31538f10-4cbd-465a-aad1-c4c2afb8b485) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Configure Gemini 2.5 Flash for AI resume analysis

This project uses the Lovable gateway by default and Google Gemini (google/gemini-2.5-flash) for resume analysis. You can explicitly configure the Gemini API key, gateway, and model using environment variables.

1) Add your API key to your environment (local) or to your Supabase project secrets (recommended):

- Windows PowerShell (sets the variable globally for your user - open a new shell after):
```powershell
setx GEMINI_API_KEY "your_api_key_here"
```

- Alternatively via Supabase CLI (recommended for local function serving):
```powershell
# Replace <project-ref> with your project ref
supabase secrets set GEMINI_API_KEY="your_api_key_here" --project-ref <project-ref>
```

2) (Optional) Set a model or gateway override

- Default model: `google/gemini-2.5-flash`. To override:
```powershell
setx GEMINI_MODEL "google/gemini-2.5-flash"
```
If you want to show the configured model in the UI during local development, set:
```powershell
setx VITE_GEMINI_MODEL "google/gemini-2.5-flash"
```

- Default gateway: `https://ai.gateway.lovable.dev/v1/chat/completions`. To override:
```powershell
setx GEMINI_GATEWAY_URL "https://your.gateway.example/v1/chat/completions"
```

3) Local testing

- Start Supabase functions locally:
```powershell
supabase functions serve analyze-resume
```

- Test using curl (replace host/port if different):
```powershell
curl -X POST "http://localhost:54321/functions/v1/analyze-resume" -H "Content-Type: application/json" -d '{"resumeText":"Experienced frontend dev with React and TypeScript...","jobDescription":"Senior Frontend Developer with React experience..."}'
```

4) Deploy

- Deploy functions with Supabase CLI
```powershell
supabase functions deploy analyze-resume
supabase functions deploy ai-assistant
```

5) Troubleshooting

- 401 / 500 - Ensure `GEMINI_API_KEY` is set either locally or in Supabase secrets.
- 429 - Rate limited; back off or increase quota from your provider.
- 402 - Billing / credits exhausted.

If you need a sample test harness for PowerShell or bash, see `supabase/functions/analyze-resume/test/request_sample.ps1` (created in this repo).

### Enabling Raptor mini (Preview) for clients

If you want the functions to use the Raptor mini preview model for all clients, set the `GEMINI_MODEL` env variable to the model name provided by your provider (for example `raptor-mini` or `google/raptor-mini`).

```powershell
setx GEMINI_MODEL "raptor-mini"
```

This will instruct both `ai-assistant` and `analyze-resume` to use Raptor mini by default when `GEMINI_API_KEY` is present and the function is called.

Alternatively, set a boolean toggle on the server to force Raptor mini for all clients (Supabase secrets or env):

```powershell
setx ENABLE_RAPTOR_MINI "true"
setx RAPTOR_MODEL_NAME "raptor-mini" # optional override
```
