/**
 * Secretariat, in the order they appear on the team page.
 *
 * For each person, `photo` is a file in /public/team (for example '/team/mahi-singh.jpg')
 * and `bio` is a few sentences, shown on their own page. Without a photo the tile shows
 * the person's initials; without a bio their page says one will be added.
 *
 * `photoPosition` is optional: when a photo's head gets cut off in its tile, set it to
 * 'top' (or any CSS object-position) to keep that part of the photo in view.
 *
 * `id` is the end of the person's page address (/team/<id>). Use lowercase words joined
 * by hyphens, such as 'mahi-singh', and keep each one unique.
 *
 * The team page shows them in rows of 4, 1, 2 and 4 (`teamRows` below), filled in this
 * order. Anything left over after those rows goes into further rows of 4.
 */
export const teamRows = [4, 1, 2, 4]

export const team = [
  { id: 'delisha-tushar-goshar', name: 'Delisha Tushar Goshar', role: 'Secretary General', photo: '/team/delisha-tushar-goshar.jpg', photoPosition: 'top', bio: "Greetings, fellow visionaries, challengers and delegates. We belong in a time where thinking, questioning and speaking up have become indispensable skills. The willingness to do so requires courage, and DYMUN '26 is a cog for that very notion. Every perspective is welcome, and every argument is heard. It's time to turn some wheels and flip some tables. May the odds ever be in your favour. I'm Delisha Goshar, your Secretary General, and I'm immensely excited to see all of you. Happy debating!" },
  { id: 'mahi-singh', name: 'Mahi Singh', role: 'Director General', photo: '/team/mahi-singh.jpg', bio: "Heyy, I'm Mahi Singh, a Grade 12 DP student, and I'm so excited to be your Director General for DYMUN 2026! I've never believed leadership means having all the answers. To me, it lies in listening with intent, staying composed amid chaos, and creating spaces where every voice feels valued. I lead with warmth, purpose and a quiet determination to make every debate meaningful, and I can't wait to share this experience with all of you." },
  { id: 'aditya-abhijit-kadam', name: 'Aditya Abhijit Kadam', role: 'Joint Secretary General', photo: '/team/aditya-abhijit-kadam.jpg', bio: "Hi, I'm Aditya, and I'm truly honoured to be your Joint Secretary General for DYMUN 2026! I've always believed that the most powerful conversations happen when people dare to disagree, and that real diplomacy begins the moment we choose to understand rather than just respond. I bring focus, integrity and an unwavering belief in the power of dialogue, and I can't wait to watch each of you rise to the challenge and make this conference unforgettable." },
  { id: 'areev-anand-shah', name: 'Areev Anand Shah', role: 'Joint Director General', photo: '/team/areev-anand-shah.jpg', bio: "Hi, I'm Areev Shah, a Grade 12 DP student, and I'm one of your Joint Directors General for DYMUN 2026. I think good debate happens when people feel safe enough to actually disagree; that's the room I want to help build this year. Looking forward to seeing what all of you bring to committee." },
  { id: 'kavish-nikhil-thakkar', name: 'Kavish Nikhil Thakkar', role: 'Advisor-in-Chief', photo: '/team/kavish-nikhil-thakkar.webp', bio: "Hi everyone! I'm Kavish Thakkar, your Advisor-in-Chief for DYMUN 2026! I'm really looking forward to being part of this journey with all of you. MUNs are a great opportunity to challenge your thinking, step outside your comfort zone, and learn to look at issues from perspectives you might not have considered before. I hope we make this conference an exciting, engaging, and worthwhile experience for everyone. Looking forward to meeting you all soon!" },
  { id: 'rida-parvez-khalfay', name: 'Rida Parvez Khalfay', role: "Chargé d'Affaires", photo: '/team/rida-parvez-khalfay.webp', bio: "Hi, I'm Rida, and I'm so excited to be your Chargé d'Affaires for DYMUN 2026! I believe every great conference is built on the connections behind it: the conversations, the coordination and the people who make it all come together. I approach my role with care, dedication and an eye for detail, making sure every delegate feels welcomed, supported and ready to shine. I can't wait to meet you all and be part of the journey that makes DYMUN truly special." },
  { id: 'dyuti-bhatt', name: 'Dyuti Bhatt', role: "Chargé d'Affaires", photo: '', bio: '' },
  { id: 'dhruv-raina', name: 'Dhruv Raina', role: 'Director of Technology', photo: '/team/dhruv-raina.webp', bio: "Hi everyone! I'm Dhruv Raina, and I'm thrilled to be your Director of Technology for DYMUN 2026. I love building the behind-the-scenes systems that keep a conference running smoothly, so every delegate can focus on what matters most: great debate." },
  { id: 'saksham-agarwal', name: 'Saksham Agarwal', role: 'Director of Technology', photo: '', bio: '' },
  { id: 'mokshitaa-gujjarlapudi', name: 'Mokshitaa Gujjarlapudi', role: 'Director of Logistics', photo: '/team/mokshitaa-gujjarlapudi.webp', bio: "A conference is remembered for the conversations it sparks, but its success is decided long before the first speaker takes the floor. I'm Mokshitaa Gujjarlapudi, a Grade 12 A-Level student and the Director of Logistics for DYMUN 2026. I'm drawn to the precision behind complex undertakings, where foresight matters as much as execution and the smallest details can shape the entire experience. For me, logistics is an exercise in anticipating the unseen, navigating the unexpected, and ensuring that every moving part serves a larger purpose. I look forward to bringing this approach to DYMUN 2026." },
  { id: 'sharvari-sachin-mhatre', name: 'Sharvari Sachin Mhatre', role: 'Director of Logistics', photo: '/team/sharvari-sachin-mhatre.webp', bio: "Hello delegates! This is your Director of Logistics. I believe that every successful conference begins with thoughtful planning and seamless coordination. With a focus on teamwork, organisation and attention to detail, I aim to create a well-structured and memorable experience for all delegates. I look forward to making this conference a success!" },
]
