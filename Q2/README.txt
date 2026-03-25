Q2 — Universal XSS (15 pts)
===========================

This problem is solved on the **14828 class CTF server** using the vulnerable extension source
released on **Canvas** (not included in this repo).

What you need to do:
1. Download the extension source from Canvas and read the code path that handles tab titles / DOM.
2. Identify unsafe use of user-controlled data (e.g. innerHTML, document.write, eval) leading to UXSS.
3. Host a malicious page (or use the CTF infra) that compromises the extension context and reads
   the flag from another tab per challenge instructions.
4. Put any exploit HTML/JS you wrote in this Q2 folder for the code zip.
5. In your PDF write-up, include: CTF username, flag, vulnerability explanation, step-by-step exploit
   (graders must reproduce it), and append your exploit source.

I cannot access your CTF account or the Canvas-only extension; complete Q2 using those materials.
