--
-- PostgreSQL database dump
--

\restrict NZ9NJ6YW8uiZrPkfae9OURein6D9m7DXQhaNwrolmdKScxTsLKCLYwlSfJ0Ksu5

-- Dumped from database version 15.14 (Debian 15.14-1.pgdg13+1)
-- Dumped by pg_dump version 15.14 (Debian 15.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: studymate_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO studymate_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: studymate_user
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: studymate_user
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO studymate_user;

--
-- Name: Flashcard; Type: TABLE; Schema: public; Owner: studymate_user
--

CREATE TABLE public."Flashcard" (
    id text NOT NULL,
    front text NOT NULL,
    back text NOT NULL,
    "noteId" text,
    "userId" text NOT NULL,
    "nextReview" timestamp(3) without time zone,
    "easeFactor" double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Flashcard" OWNER TO studymate_user;

--
-- Name: Note; Type: TABLE; Schema: public; Owner: studymate_user
--

CREATE TABLE public."Note" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Note" OWNER TO studymate_user;

--
-- Name: Progress; Type: TABLE; Schema: public; Owner: studymate_user
--

CREATE TABLE public."Progress" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "quizzesTaken" integer DEFAULT 0 NOT NULL,
    "flashcardsReviewed" integer DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "notesCreated" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Progress" OWNER TO studymate_user;

--
-- Name: Quiz; Type: TABLE; Schema: public; Owner: studymate_user
--

CREATE TABLE public."Quiz" (
    id text NOT NULL,
    title text NOT NULL,
    "noteId" text,
    "userId" text NOT NULL,
    score integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "totalQuestions" integer
);


ALTER TABLE public."Quiz" OWNER TO studymate_user;

--
-- Name: QuizQuestion; Type: TABLE; Schema: public; Owner: studymate_user
--

CREATE TABLE public."QuizQuestion" (
    id text NOT NULL,
    "quizId" text NOT NULL,
    question text NOT NULL,
    options text[],
    "correctAnswer" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."QuizQuestion" OWNER TO studymate_user;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: studymate_user
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO studymate_user;

--
-- Name: User; Type: TABLE; Schema: public; Owner: studymate_user
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text,
    "emailVerified" timestamp(3) without time zone,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    password text,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    bio text,
    "firstName" text,
    "lastName" text,
    university text
);


ALTER TABLE public."User" OWNER TO studymate_user;

--
-- Name: UserPreference; Type: TABLE; Schema: public; Owner: studymate_user
--

CREATE TABLE public."UserPreference" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "learningGoal" text,
    theme text,
    "aiStyle" text
);


ALTER TABLE public."UserPreference" OWNER TO studymate_user;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: studymate_user
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO studymate_user;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: studymate_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO studymate_user;

--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: studymate_user
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
cmhl0rrzd0001v0r4g9qmha63	cmh7tggvc0000v08cffsye3rv	credentials	credentials	cmh7tggvc0000v08cffsye3rv	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: Flashcard; Type: TABLE DATA; Schema: public; Owner: studymate_user
--

COPY public."Flashcard" (id, front, back, "noteId", "userId", "nextReview", "easeFactor", "createdAt", "updatedAt") FROM stdin;
cmh7shp200006v0x8twggnafo	What is the main pigment in photosynthesis?	Chlorophyll	\N	cmh7shp1j0000v0x81bx2i4w3	\N	\N	2025-10-26 14:13:47.929	2025-10-26 14:13:47.929
cmh7shp200007v0x85b9ej1y9	Newton's Third Law states?	For every action, there is an equal and opposite reaction.	\N	cmh7shp1q0001v0x8mzq0ggf1	\N	\N	2025-10-26 14:13:47.929	2025-10-26 14:13:47.929
\.


--
-- Data for Name: Note; Type: TABLE DATA; Schema: public; Owner: studymate_user
--

COPY public."Note" (id, title, content, "userId", "createdAt", "updatedAt") FROM stdin;
cmh7shp1v0003v0x8eio2oqav	Photosynthesis Overview	Photosynthesis is the process by which green plants convert light energy into chemical energy. It involves chlorophyll and occurs in chloroplasts.	cmh7shp1j0000v0x81bx2i4w3	2025-10-26 14:13:47.923	2025-10-26 14:13:47.923
cmh7shp1y0005v0x8cfm8z59j	Newton's Laws of Motion	Newton's First Law: An object in motion stays in motion unless acted upon by an external force.	cmh7shp1q0001v0x8mzq0ggf1	2025-10-26 14:13:47.926	2025-10-26 14:13:47.926
\.


--
-- Data for Name: Progress; Type: TABLE DATA; Schema: public; Owner: studymate_user
--

COPY public."Progress" (id, "userId", "quizzesTaken", "flashcardsReviewed", "updatedAt", "createdAt", "notesCreated") FROM stdin;
cmh7shp28000av0x8tps1iskw	cmh7shp1j0000v0x81bx2i4w3	3	15	2025-10-26 14:13:47.937	2025-10-26 14:13:47.937	0
cmh7shp28000bv0x82cytyw71	cmh7shp1q0001v0x8mzq0ggf1	1	10	2025-10-26 14:13:47.937	2025-10-26 14:13:47.937	0
\.


--
-- Data for Name: Quiz; Type: TABLE DATA; Schema: public; Owner: studymate_user
--

COPY public."Quiz" (id, title, "noteId", "userId", score, "createdAt", "updatedAt", "totalQuestions") FROM stdin;
cmh7shp240008v0x8ryvl58sy	Photosynthesis Quiz	\N	cmh7shp1j0000v0x81bx2i4w3	85	2025-10-26 14:13:47.933	2025-10-26 14:13:47.933	\N
cmh7shp240009v0x8tzy39h8k	Physics Fundamentals Quiz	\N	cmh7shp1q0001v0x8mzq0ggf1	90	2025-10-26 14:13:47.933	2025-10-26 14:13:47.933	\N
\.


--
-- Data for Name: QuizQuestion; Type: TABLE DATA; Schema: public; Owner: studymate_user
--

COPY public."QuizQuestion" (id, "quizId", question, options, "correctAnswer", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: studymate_user
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: studymate_user
--

COPY public."User" (id, name, email, "emailVerified", image, "createdAt", password, "updatedAt", bio, "firstName", "lastName", university) FROM stdin;
cmh7shp1j0000v0x81bx2i4w3	Alice Johnson	alice@example.com	\N	\N	2025-10-26 14:13:47.911	$2b$10$KBl5cnK4aqTM83eQZbc3qOlqGENCoXyvBFA7qSljhhE7aFQ.BXZaC	2025-10-26 14:13:47.911	\N	\N	\N	\N
cmh7shp1q0001v0x8mzq0ggf1	Bob Smith	bob@example.com	\N	\N	2025-10-26 14:13:47.919	$2b$10$KBl5cnK4aqTM83eQZbc3qOlqGENCoXyvBFA7qSljhhE7aFQ.BXZaC	2025-10-26 14:13:47.919	\N	\N	\N	\N
cmh7tjx4c0000v0is2vsjs7ey	Misio Pysio	admin@juwenalia.com	\N	\N	2025-10-26 14:43:31.308	$2b$10$w/3wxSb7YC4Wag3k2sbYJOSx4qETuXJ0Aq/ges/uhRLZiyqiyb0eW	2025-10-26 14:43:31.308	\N	\N	\N	\N
cmh7tmeud0000v02kri93j8e2	Misio Pysio	admin@juwenalia.com2	\N	\N	2025-10-26 14:45:27.59	$2b$10$ZMEiFaxLjfFzChvmGofbLOIUWOWfArBf2PmIMrFiOgs0R1M2amSGC	2025-10-26 14:45:27.59	\N	\N	\N	\N
cmh7tonca0000v0jcuju0i7t6		addmin@juwenalia.pl	\N	\N	2025-10-26 14:47:11.914	$2b$10$dZPauUIe87Pbq5F25hG7PeUnkY1QveQ1BCba/T/O63lABdGXxbcV.	2025-10-26 14:47:11.914	\N	\N	\N	\N
cmh7tvrns0000v0jgthpluvwp	Misio Pysio	a@a.a	\N	\N	2025-10-26 14:52:44.105	$2b$10$n0/2Hc1Hu5vWPn9KC30FXuxgiJH6RKxS5ajphOg4vgj4rFPrH8Qo2	2025-10-26 14:52:44.105	\N	\N	\N	\N
cmh7u1lp30001v0jgb0a0yrhq	Misio Pysio	admin@juwecnalia.pl	\N	\N	2025-10-26 14:57:16.311	$2b$10$ifUQLl.J6RCx7nlpAvIRmOftDdZNCegT3hO/2qIfds74feP4kiJ3u	2025-10-26 14:57:16.311	\N	\N	\N	\N
cmh7u3gg70000v0a4vjjvrwd7	Misio Pysio	aadmin@juwenalia.pl	\N	\N	2025-10-26 14:58:42.823	$2b$10$U/7oWxZP9kkFtRh4jCivn./jqfTFRAuIORc8gVOFvTwQKAFlnrsrW	2025-10-26 14:58:42.823	\N	\N	\N	\N
cmh7v5gji0000v0qc0piq1np5	Misio Pysio	juwenalia@admin.pl	\N	\N	2025-10-26 15:28:15.87	$2b$10$76B8dNbHGmQVkW1N/8swxOATTKZfi39hKEfalKPRU7z0pJU.I.dua	2025-10-26 15:28:15.87	\N	\N	\N	\N
cmhic9nd70000v0m0dgtzczmp	E	E@E.E	\N	/uploads/profile-photos/profile-cmhic9nd70000v0m0dgtzczmp-1762264713055.webp	2025-11-02 23:25:06.571	$2b$10$/XR9EsbtMhZzuWvayRj78.gYkveoNac.jug2vxT3S5CWvEY1DEtCq	2025-11-04 13:58:33.121	\N	\N	\N	\N
cmh7tggvc0000v08cffsye3rv	Misio Pysio	admin@juwekrk.pl	\N	/uploads/profile-photos/profile-cmh7tggvc0000v08cffsye3rv-1762294125749.webp	2025-10-26 14:40:50.28	$2b$10$SiUbdgLxKd4Zw1h6U9gZJ.oc2BSiRE/zkQ2nNE/h1IuapaJYt13Eu	2025-11-04 22:08:45.837	test	Eryk	Michalczyk	AGH
\.


--
-- Data for Name: UserPreference; Type: TABLE DATA; Schema: public; Owner: studymate_user
--

COPY public."UserPreference" (id, "userId", "learningGoal", theme, "aiStyle") FROM stdin;
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: studymate_user
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: studymate_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
ceec0e7c-c834-4460-a823-bd3303f9a336	c12f69ca4a3362c5db4727a4379393035224fe0d3b247123b50055ab63b300f4	2025-10-26 14:09:53.337179+00	20251026125115_init	\N	\N	2025-10-26 14:09:53.29121+00	1
7531e929-9e20-4fcb-9212-0405d6e64808	31b7cd4da469c16b61ff303590eb1e2ad76bb39add7842baebed925cf0122e45	2025-10-26 14:09:53.386795+00	20251026140729_cleanup_user_model	\N	\N	2025-10-26 14:09:53.33915+00	1
9f93e64d-b33c-4184-8aca-bb50090f8174	fb2e5bf2634dd74983e042262d6b65f5cf2b24083e9706148b36e5079db5b29c	2025-10-26 14:12:53.203528+00	20251026141253_fix_relations_and_add_total_questions	\N	\N	2025-10-26 14:12:53.19+00	1
19faf6a8-ba36-4e90-8a89-05e6c92b375f	6b97c27ec908976c41e963cdbc53eccc4ed6d27d08e6cbbd3a83399ef11b3fab	2025-11-03 20:21:15.248944+00	20251103202115_add_avatar_url	\N	\N	2025-11-03 20:21:15.240351+00	1
00d10d0f-2db7-4fe5-bfad-bfe7590fa945	f34c802215b4c68d76e54a0e79e6d206b5819d987d0408e954c33d1edeee4fb3	2025-11-03 20:25:30.805077+00	20251103202530_avatarurldelete	\N	\N	2025-11-03 20:25:30.795187+00	1
59816248-1bb8-4f47-be2c-44dbe350b4f0	ff13433d7309138b0984c42ceee9182d038ae7535ac46b12dc20abe32fb4619c	2025-11-03 21:27:02.034908+00	20251103212702_add_profile_fields	\N	\N	2025-11-03 21:27:02.027311+00	1
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Flashcard Flashcard_pkey; Type: CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Flashcard"
    ADD CONSTRAINT "Flashcard_pkey" PRIMARY KEY (id);


--
-- Name: Note Note_pkey; Type: CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "Note_pkey" PRIMARY KEY (id);


--
-- Name: Progress Progress_pkey; Type: CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_pkey" PRIMARY KEY (id);


--
-- Name: QuizQuestion QuizQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."QuizQuestion"
    ADD CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY (id);


--
-- Name: Quiz Quiz_pkey; Type: CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: UserPreference UserPreference_pkey; Type: CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."UserPreference"
    ADD CONSTRAINT "UserPreference_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: studymate_user
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: studymate_user
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: UserPreference_userId_key; Type: INDEX; Schema: public; Owner: studymate_user
--

CREATE UNIQUE INDEX "UserPreference_userId_key" ON public."UserPreference" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: studymate_user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: studymate_user
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: studymate_user
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Flashcard Flashcard_noteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Flashcard"
    ADD CONSTRAINT "Flashcard_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES public."Note"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Flashcard Flashcard_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Flashcard"
    ADD CONSTRAINT "Flashcard_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Note Note_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Progress Progress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Progress"
    ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizQuestion QuizQuestion_quizId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."QuizQuestion"
    ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES public."Quiz"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Quiz Quiz_noteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES public."Note"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Quiz Quiz_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Quiz"
    ADD CONSTRAINT "Quiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserPreference UserPreference_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: studymate_user
--

ALTER TABLE ONLY public."UserPreference"
    ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: studymate_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict NZ9NJ6YW8uiZrPkfae9OURein6D9m7DXQhaNwrolmdKScxTsLKCLYwlSfJ0Ksu5

