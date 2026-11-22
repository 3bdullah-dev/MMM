// ============ إعدادات الموقع (عدّل من هنا فقط) ============
// cover: ضع رابط صورة عمودية 9:16 (مثلاً من Cloudinary) لو عايز صورة معاينة مخصصة
const siteConfig = {
  profile: {
    name: "Abdullah Ahmed",
    nameAr: "عبدالله أحمد",
    tagline: "مونتير فيديوهات ريلز محترف",
    email: "abdallahmohamed.up@gmail.com",
    whatsapp: "201098042976",
    instagram: "3bdallah.pk",
    tiktok: "3bdallah.pk",
  },
  projects: [
    {id:1,category:"reels",title:"Reel — Hook قوي وموشن جرافيك",description:"Hook قوي في أول 3 ثوانٍ + موشن جرافيك + ترجمات جذابة",videoId:"tKD5nnUhVEk",cover:"",tags:["موشن جرافيك", "ترجمات"]},
    {id:2,category:"reels",title:"Reel — ترجمات ديناميكية وإيقاع سريع",description:"ترجمات متحركة + قص سريع + موسيقى تريند",videoId:"KvTD7L4suc0",cover:"",tags:["ترجمات", "تريند"]},
    {id:3,category:"reels",title:"Reel — موسيقى تريند ومؤثرات",description:"مزج الموسيقى والمؤثرات الصوتية مع حركة الكاميرا",videoId:"L956zYHjPMs",cover:"",tags:["موشن جرافيك", "مؤثرات"]},
    {id:4,category:"shorts",title:"YouTube Short — Storytelling",description:"ستوري تيلينج + نصوص متحركة + إيقاع سريع",videoId:"YYXh0LcqAIk",cover:"",tags:["نصوص متحركة", "ستوري تيلينج"]},
    {id:5,category:"tiktok",title:"TikTok — تريند سريع",description:"محتوى تريندي بإيقاع سريع ومؤثرات صوتية",videoId:"nyYBwnYf3sg",cover:"",tags:["تريند", "مؤثرات"]},
    {id:6,category:"reels",title:"Reel — تصحيح ألوان سينمائي",description:"تعديل سريع + تصحيح ألوان سينمائي + انتقالات سلسة",videoId:"aY1pQbV9vnk",cover:"",tags:["تصحيح ألوان", "تأثيرات"]},
    {id:7,category:"shorts",title:"YouTube Short — نصوص متحركة",description:"Kinetic typography مع إيقاع يحافظ على المشاهدة",videoId:"2zZlqrjOe8g",cover:"",tags:["نصوص متحركة", "شورتس"]},
    {id:8,category:"tiktok",title:"TikTok — مؤثرات وانتقالات",description:"انتقالات سريعة ومؤثرات صوتية تناسب التريند",videoId:"mLpMI7qb9Ec",cover:"",tags:["تريند", "انتقالات"]},
  ],
};

// ============ صورة بديلة لو maxresdefault مش موجودة ============
function thumbFallback(img) {
  const list = ["hqdefault", "mqdefault"];
  const i = parseInt(img.dataset.step || "0", 10);
  if (i < list.length) {
    img.dataset.step = i + 1;
    img.src = `https://img.youtube.com/vi/${img.dataset.vid}/${list[i]}.jpg`;
  } else {
    img.style.display = "none";
  }
}

// ============ تشغيل فيديو واحد فقط في الوقت ============
let activeContainer = null;

function resetVideo() {
  if (!activeContainer) return;
  activeContainer.innerHTML = activeContainer.dataset.html;
  bindPlaceholder(activeContainer.querySelector(".video-placeholder"));
  activeContainer.dataset.active = "false";
  activeContainer = null;
}

function activateVideo(placeholder) {
  const container = placeholder.closest(".video-container");
  if (!container) return;
  resetVideo();
  container.dataset.html = container.innerHTML;
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${placeholder.dataset.videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&hl=ar`;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  iframe.title = "فيديو من أعمالي";
  container.replaceChild(iframe, placeholder);
  container.dataset.active = "true";
  activeContainer = container;
}

function bindPlaceholder(p) {
  if (!p) return;
  p.addEventListener("click", () => activateVideo(p));
  p.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activateVideo(p);
    }
  });
}

// ============ بناء الكروت ============
function loadProjects() {
  const grid = document.getElementById("portfolio-grid");
  if (!grid) return;
  const valid = siteConfig.projects.filter((p) => p.videoId);
  grid.innerHTML = valid
    .map((p) => {
      const src = p.cover || `https://img.youtube.com/vi/${p.videoId}/maxresdefault.jpg`;
      return `
      <div class="video-card real-card" data-aos="fade-up" data-category="${p.category}">
        <div class="video-container">
          <div class="video-placeholder" data-video-id="${p.videoId}" role="button" tabindex="0" aria-label="تشغيل: ${p.title}">
            <img src="${src}" alt="${p.title}" class="video-thumb" loading="lazy" decoding="async" data-vid="${p.videoId}" onerror="thumbFallback(this)" />
            <div class="play-btn" aria-hidden="true"><i class="fas fa-play"></i></div>
            <div class="video-overlay" aria-hidden="true"></div>
          </div>
        </div>
        <div class="video-info">
          <h3 class="video-title">${p.title}</h3>
          <p class="video-desc">${p.description}</p>
          <div class="video-tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        </div>
      </div>`;
    })
    .join("");
  grid.querySelectorAll(".video-placeholder").forEach(bindPlaceholder);
  if (typeof AOS !== "undefined") AOS.refresh();
}

// ============ فلترة الأعمال ============
function bindFilters() {
  const btns = document.querySelectorAll(".filter-btn");
  btns.forEach((b) =>
    b.addEventListener("click", () => {
      resetVideo();
      btns.forEach((x) => x.classList.toggle("active", x === b));
      const f = b.dataset.filter;
      document.querySelectorAll("#portfolio-grid .video-card").forEach((c) => {
        c.hidden = !(f === "all" || c.dataset.category === f);
      });
    }),
  );
}

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  bindFilters();
});
