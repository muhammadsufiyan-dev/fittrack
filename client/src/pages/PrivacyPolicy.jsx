function PrivacyPolicy() {
  return (
    <div className="container">
      <article className="policy">
        <h1 className="fit-title auth-heading">
          Privacy <span className="gradient-text">policy</span>
        </h1>
        <p>This page explains what FitTrack collects, why we collect it and the choices you have.</p>

        <h2>What we collect</h2>
        <ul>
          <li>Your name and email address when you create an account.</li>
          <li>If you continue with Google, the name and verified email address Google shares with us. We never see your Google password.</li>
          <li>The workouts, meals and measurements you choose to log.</li>
          <li>Your theme preference, so the site looks the way you left it.</li>
          <li>Your community posts, comments and the members you follow. Other members can see these.</li>
        </ul>

        <h2>How we use it</h2>
        <p>
          We use your information only to run FitTrack for you: to sign you in, show your own data and build your
          charts and reports. We use your email only to verify your account and to send password reset links. We do not sell your data.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>You can see and edit your details at any time.</li>
          <li>You can download a copy of your data.</li>
          <li>You can delete your account and everything stored with it.</li>
        </ul>

        <h2>Keeping your data safe</h2>
        <p>
          Passwords are stored as one-way hashes, never in plain text, and your data is only visible to you unless you
          choose to share it.
        </p>

        <h2>Questions</h2>
        <p>If anything here is unclear, use the Support page after you log in and we will help.</p>
      </article>
    </div>
  )
}

export default PrivacyPolicy
