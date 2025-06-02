#### Vibe Coding Journal – Entry 1

**Date:** 2025-06-01

I’ve created a new repository called **`vibe-jam`**. The idea is to house multiple projects inside it, each in its own sub-directory, organized by implementation technology. Each project will have its own `README.md` detailing the specific _vibe-stack_ used.

---

I started with a user authentication system built in **Node.js**. Initially, I asked **Claude 4** to set up the project. As expected, it didn’t just stop at the basics—it kept going. _Way_ beyond. It added:

- A full auth controller
- A two-factor controller
- Rate limiting middleware
- A bunch of test files:
  - `test-auth.js`
  - `test-auth-comprehensive.js`
  - `test-auth-fresh.js`
  - `test-simple.js`
  - `test-comprehensive-final.js`

It had already created **22 files** and showed no signs of stopping, so I decided to cancel the run and delete the entire setup.

---

After that, I switched gears and tried out **`o4-mini`**. So far, the experience has been refreshingly different. It’s more measured—being a _thinking model_, it’s a bit slow, but in a good way. I prompted it with what I wanted to build, and it responded with a basic but well-thought-out setup. It told me what it had done and then paused, waiting for my input before proceeding further.

---

One standout feature of this vibe coding setup (or copilot tooling in general) is its **ask mode**. It lets me explore and clarify code or architecture decisions without making any changes to the actual state. This is proving really useful—I can dig deeper into unfamiliar parts or brainstorm new features without worrying about messing anything up.

The slowness of `o4-mini` is a fair tradeoff for the **quality of code** it writes and the **level of control** I retain. I’m okay with that.

---

I’ve now implemented most of the **core system requirements**. Wrapping up the day by adding some proper documentation:

- **API documentation** via Swagger
- **Project introduction & setup** instructions in respective `README.md` files

---

That’s it for today. Looking forward to continuing this little vibe coding experiment over the coming days.
