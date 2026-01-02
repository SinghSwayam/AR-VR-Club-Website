# AR/VR Club GHRCEM 
![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

<div align="center">

![Project Banner](public/Assets/logo-clear-bg.png)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

**The official portfolio and management website for the AR/VR Club at GHRCEM.**
Showcasing events, team members, and club activities.

[Explore Docs](./docs) · [Report Bug](https://github.com/aNsHuL5217/AR-VR-Club-Website/issues) · [Request Feature](https://github.com/aNsHuL5217/AR-VR-Club-Website/issues)

</div>

---

## About The Project

The **AR/VR Club GHRCEM Portfolio** serves as the digital face of our community. It allows students to explore upcoming events, register for workshops, and learn about the club's mission. Behind the scenes, it features a robust management system for administrators.

### Key Features

*   **Modern Portfolio**: A visually engaging platform to showcase club achievements and galleries.
*   **Event Management**: Centralized system for listing and managing workshops and meetups.
*   **User Registration**: Seamless sign-up process for students to join the club and attend events.
*   **Real-time Updates**: Instant reflection of new events and announcements.
*   **Responsive Design**: A consistent experience across desktop and mobile devices.

## Tech Stack

*   **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/).
*   **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL).
*   **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth).
*   **Animations**: [Framer Motion](https://www.framer.com/motion/).

## Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

*   **Node.js** (v18 or higher)
*   **npm** or **yarn**

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/aNsHuL5217/AR-VR-Club-Website.git
    cd ar-vr-club-ghrcem
    ```

2.  **Install dependencies**
    ```sh
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory. You will need API keys for Firebase and Supabase.
    
    > **Setup Guide**: Follow the [Complete Setup Guide](./docs/SETUP_GUIDE.md) to configure your environment variables and database.

4.  **Run the development server**
    ```sh
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

```
ar-vr-club-ghrcem/
├── docs/                # Documentation & Setup Guides
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router (Pages & API)
│   ├── components/      # Reusable React components
│   ├── lib/             # Services (Firebase, Supabase)
│   ├── context/         # Global state (Auth)
│   └── styles/          # Global styles
├── supabase/            # Database migrations & schemas
└── ...
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Maintainers

**Anshul Zilpe** - [GitHub](https://github.com/aNsHuL5217)

**Swayam Singh** - [GitHub](https://github.com/SinghSwayam)

Project Link: [https://github.com/aNsHuL5217/AR-VR-Club-Website](https://github.com/aNsHuL5217/AR-VR-Club-Website)
