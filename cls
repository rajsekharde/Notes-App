[33mcommit bcb21ecf630c074a2d52437bfd4838e071c883e0[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mfeature/user-authentication[m[33m)[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sat Dec 6 20:36:47 2025 +0530

    Updated frontend fetch operations for notes, ran alembic migration for adding is_admin field to user

[33mcommit bad9446b2fda93bb852db3186bdbfa4a5b50df67[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sat Dec 6 19:56:04 2025 +0530

    Added Login Page

[33mcommit 8b29f434c193e3b2fcbc47e3055a9f70bb9ab7d3[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sat Dec 6 18:24:29 2025 +0530

    Set up frontend functions for fetching auth APIs

[33mcommit d285465a2b6bd367b55bc032f5e2dad7ebdc7cb0[m[33m ([m[1;31morigin/feature/user-authentication[m[33m)[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sat Dec 6 15:03:41 2025 +0530

    Fix: Documentation

[33mcommit 87137725987f519e1455c862025468179a4be4a7[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sun Nov 30 17:06:22 2025 +0530

    Setup and ran pytest for auth + note crud routes. Complete backend is functional now

[33mcommit e8558e79e80d05bfd35725d4b9a5c46b66295052[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sun Nov 30 16:46:56 2025 +0530

    Updated notes routes to validate user before performing crud operations

[33mcommit 943c39095c8755c2207c7f1292a1cc56247c8dea[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sun Nov 30 16:15:14 2025 +0530

    Ran Alembic migrations for adding User, RefreshToken tables to DB, fixed table relationship bugs

[33mcommit b117d985399b0bb299834bb31fb9af56a0c0ee72[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sun Nov 30 14:59:07 2025 +0530

    Added Logout route, included auth_router in main app

[33mcommit c8085a666d2eaca5245aa31cbc2b061b269161d2[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sun Nov 30 14:46:42 2025 +0530

    Added Refresh Token Route

[33mcommit b390b179ef502c2d911c10473ce97becd80396df[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sun Nov 30 14:36:31 2025 +0530

    Added Login route

[33mcommit 99e8acda8fae70a41e44590df3236bd134bf6a2c[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sun Nov 30 14:23:33 2025 +0530

    Added auth.py router, register route

[33mcommit 6d20d5a3851c56586f8a16cd2b891e5deed76566[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sun Nov 30 03:34:20 2025 +0530

    Add security-env connection via config.py

[33mcommit c35839be74c7b538a04041879df40ea6584b7450[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sun Nov 30 02:14:09 2025 +0530

    Added password hashing + JWT utilities

[33mcommit 4694a5c0338765f07ab385c2f2294896f8573771[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sun Nov 30 01:50:33 2025 +0530

    Added request/response schemas for user, token

[33mcommit ccfa490847635996ab4581f981492242bffb7d51[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sun Nov 30 00:57:42 2025 +0530

    Added User model, user_id field to Note model

[33mcommit 6b1bdb5595a75ee2740a62b7dae469d2ba9bbb54[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sat Nov 29 18:36:45 2025 +0530

    Fixed file path bug

[33mcommit 73199e16e5620fe726f73a01a9b3aa7288c2a7a8[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sat Nov 29 18:30:53 2025 +0530

    Fixing file path bugs

[33mcommit f999bd2664221d5f2d6a370f19a0efb3acbcfe08[m
Merge: 399f7ae 206beda
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sat Nov 29 18:16:07 2025 +0530

    Merge pull request #1 from RsD1405/frontend/add-notes-page
    
    Added Frontend

[33mcommit 206beda057c49fa4bed3f9f50846981aa247cb02[m[33m ([m[1;31morigin/frontend/add-notes-page[m[33m, [m[1;32mfrontend/add-notes-page[m[33m)[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sat Nov 29 18:01:09 2025 +0530

    Added Notes page to Frontend

[33mcommit 960a95094061cf7c6d8fbb5b35c05dbcfaa578bd[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Thu Nov 20 16:15:10 2025 +0530

    Added Update, Delete functions

[33mcommit d10d8683c165706b2ebdae37af11cad5d5907ee5[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Thu Nov 20 03:03:53 2025 +0530

    UI Fixes

[33mcommit 0277fb9e087c81f9bfe4d958b426a00b36532c06[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Thu Nov 20 02:40:04 2025 +0530

    UI Changes

[33mcommit 14e21e95397cea8cce0db4fb1e1126f9691cf3d4[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Thu Nov 20 01:46:45 2025 +0530

    Added sorting notes by created_at

[33mcommit 3e9d465220d9e36346c1e6a3200f6099f38be558[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Thu Nov 20 01:41:19 2025 +0530

    Added create note function

[33mcommit dd75c679e04549f7cbee521d3a4772e953e7b620[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Thu Nov 20 01:01:57 2025 +0530

    Connected notes page to backend

[33mcommit 73c110066da292abf828a66d93e1bbf7e86a29c1[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Thu Nov 20 00:49:48 2025 +0530

    Added Notes modal component

[33mcommit 8292cdf0543fa3890427db239c4531bbc02620fc[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Thu Nov 20 00:30:59 2025 +0530

    Set up React Router and added Notes page

[33mcommit 399f7ae8f6b741afa2c5104d57493e3962f7516f[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Wed Nov 19 01:43:14 2025 +0530

    Added .env.example for frontend, backend

[33mcommit dc58a82d3c7da5fe8628279a1b63fdc5fca56e1b[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Wed Nov 19 01:42:25 2025 +0530

    Added .env.example for frontend, backend

[33mcommit 1250f781a0bcad2430c36c408cafa986c3935fc8[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Wed Nov 19 01:34:07 2025 +0530

    Created Notes page- fetches notes from backend

[33mcommit 388d0ee657ea0430f9353ca576aca43a06f32753[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Wed Nov 19 00:25:26 2025 +0530

    Installed React for frontend

[33mcommit 01d7ffe1d592c96d2353df915c6071e64d4790ec[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Tue Nov 18 02:38:56 2025 +0530

    add comments, notes for future reference

[33mcommit f4edf109c12acd6cac5292a5076f9f59fbb05886[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Mon Nov 17 22:48:51 2025 +0530

    Setup backend + db migration + api endpoint tests. Backend is functional now

[33mcommit 72727e6df3722cb82597dca2fc0a5e5d66f11d3e[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Mon Nov 17 00:38:43 2025 +0530

    Applied .gitignore & clean tracked files

[33mcommit 33c2f52aecdd8d04cee771af76fc6fa708c9eb14[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Mon Nov 17 00:01:20 2025 +0530

    Added models, database, core.config, env in backend. Setup Alembic for migrations.

[33mcommit 9a585538e8565e5b0ca8a8e41682f8e2a08f49d2[m
Author: RsD1405 <rajsekharde612@gmail.com>
Date:   Sun Nov 16 21:34:53 2025 +0530

    Initial Commit
