import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
const styleVersion = createHash('sha256').update(await readFile(path.join(root, 'assets/style.css'))).digest('hex').slice(0, 12);
const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
const escape = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const inline = (s) => escape(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
const projects = [
  { slug: 'english-platform', name: 'English Platform', type: 'EDUCATION · WEB APPLICATION', category: 'web', number: '01', title: 'Một nền tảng.\nKết nối cả lớp học.', description: 'Kết nối quản lý trung tâm tiếng Anh, giảng dạy và học tập trong một hệ thống SaaS đa đơn vị.', tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'LiveKit'], color: 'education', label: 'Nền tảng giáo dục', mark: 'E', roles: ['Quản trị nền tảng', 'Quản lý trung tâm', 'Giáo viên & học viên'] },
  { slug: 'auto-video-platform', name: 'Auto Video Platform', type: 'AI & AUTOMATION · MEDIA', category: 'ai', number: '02', title: 'Từ một video.\nĐến nhiều ngôn ngữ.', description: 'Quy trình xử lý video với AI: nhận dạng giọng nói, tạo phụ đề, dịch nội dung và tổng hợp giọng đọc.', tech: ['Go', 'Python', 'FFmpeg', 'React'], color: 'video', label: 'AI & tự động hóa', mark: 'V', roles: ['Âm thanh', 'Nhận dạng', 'Dịch thuật', 'Giọng đọc'] },
  { slug: 'tablepro', name: 'TablePro', type: 'DEVELOPER TOOLS · DESKTOP', category: 'desktop', number: '03', title: 'Không gian làm việc\ncủa dữ liệu.', description: 'Database client bằng C++ và Qt, với SQL editor, data grid và hệ thống connector dạng plugin.', tech: ['C++20', 'Qt 6', 'CMake', 'SQL'], color: 'database', label: 'Ứng dụng desktop', mark: 'T', roles: ['MySQL', 'PostgreSQL', 'SQLite', 'MariaDB'] },
];

projects.push(
  { slug: 'world-will-die', name: 'World Will Die', type: 'DATA & SIMULATION · WORLD ECONOMY', category: 'simulation', number: '04', title: 'Khám phá dữ liệu.\nMô phỏng những khả năng.', description: 'Khám phá dữ liệu kinh tế thế giới, xây dựng kịch bản what-if và phân tích tác động qua đồ thị nhân quả.', tech: ['Python', 'FastAPI', 'Next.js', 'PostgreSQL'], label: 'Dữ liệu & mô phỏng' },
  { slug: 'oxy-iot', name: 'OxyIoT', type: 'IOT · REALTIME MONITORING', category: 'iot', number: '05', title: 'Kết nối thiết bị.\nTheo dõi từng biến động.', description: 'Thu thập dữ liệu thiết bị oxygen qua MQTT và Modbus, lưu lịch sử và cập nhật thông số theo thời gian thực.', tech: ['Go', 'MQTT', 'MongoDB', 'Redis'], label: 'IoT & giám sát thiết bị' },
);
const projectCount = String(projects.length).padStart(2, '0');

function art(p) {
  if (p.category === 'simulation' || p.category === 'iot') {
    const simulation = p.category === 'simulation';
    return `<div class="art ${simulation ? 'education' : 'video'}" aria-hidden="true"><span class="art-label">${simulation ? 'EXPLORE A CONNECTED WORLD.' : 'CONNECTED DEVICES. LIVE INSIGHTS.'}</span><div class="wave">${Array.from({ length: 29 }, (_, i) => `<i style="--bar:${20 + ((i * 23) % 80)}%;background:currentColor"></i>`).join('')}</div><div class="language-line"><span>${simulation ? 'What if?' : 'O₂'}</span><span>${simulation ? 'World economy' : 'Telemetry'}</span></div><div class="pipeline"><span>${simulation ? 'DATA' : 'DEVICE'}</span><b>→</b><span>${simulation ? 'SCENARIO' : 'MQTT'}</span><b>→</b><span>${simulation ? 'SIMULATION' : 'INSIGHTS'}</span></div><span class="art-bottom">${simulation ? 'MODEL / SIMULATE / EXPLORE' : 'COLLECT / STORE / MONITOR'}</span></div>`;
  }
  if (p.category === 'web') return `<div class="art education" aria-hidden="true"><span class="art-label">LEARNING, CONNECTED.</span><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="edu-core">e<span>English Platform</span></div><span class="orbit-tag tag-one">Trung tâm</span><span class="orbit-tag tag-two">Giáo viên</span><span class="orbit-tag tag-three">Học viên</span><span class="art-bottom">ONE PLATFORM / MANY POSSIBILITIES</span></div>`;
  if (p.category === 'ai') return `<div class="art video" aria-hidden="true"><span class="art-label">A NEW VOICE FOR YOUR VIDEO.</span><div class="wave">${Array.from({ length: 29 }, (_, i) => `<i style="--bar:${[18,30,50,75,42,95,62,38,82,100,65,35,57,90,45][i % 15]}%"></i>`).join('')}</div><div class="language-line"><span>Xin chào.</span><span>Hello.</span><span>こんにちは。</span></div><div class="pipeline"><span>VIDEO</span><b>→</b><span>AI</span><b>→</b><span>VOICE</span></div><span class="art-bottom">SPEECH / TRANSLATE / RENDER</span></div>`;
  return `<div class="art database" aria-hidden="true"><span class="art-label">A CLEARER VIEW OF YOUR DATA.</span><div class="db-window"><div class="window-top"><i></i><i></i><i></i><span>workspace.sql</span></div><div class="query"><em>SELECT</em> ideas, possibilities<br><em>FROM</em> your_next_project;</div><div class="data-lines"><span>id</span><span>project</span><span>type</span><span>01</span><span>TablePro</span><span>desktop</span><span>02</span><span>UI Kit</span><span>design</span></div></div><span class="art-bottom">CONNECT / QUERY / EXPLORE</span></div>`;
}

function contact(prefix) {
  return `<section class="contact wrap" id="lien-he"><div><p class="eyebrow">TRAO ĐỔI NHU CẦU HỢP TÁC</p><h2>Bài toán của bạn.<br><span>Giải pháp phù hợp.</span></h2><p>Chia sẻ bài toán, quy trình hiện tại và mục tiêu của bạn để cùng xác định phạm vi giải pháp.</p></div><div class="contact-action">${config.email ? `<a class="button dark" href="mailto:${escape(config.email)}">Trao đổi qua email <span>↗</span></a>` : `<a class="button dark" href="${escape(config.github)}" target="_blank" rel="noopener noreferrer">Kết nối trên GitHub <span>↗</span></a>`}<span>Phần mềm doanh nghiệp · Dữ liệu · AI · IoT</span></div></section>`;
}

function layout({ title, description, body, prefix = './', canonical = '', kind = 'website' }) {
  return `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f6f5f0"><title>${escape(title)} | ${escape(config.name)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${escape(config.url + '/' + canonical)}"><meta property="og:type" content="${kind}"><meta property="og:title" content="${escape(title)} | ${escape(config.name)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(config.url + '/' + canonical)}"><meta property="og:locale" content="vi_VN"><meta property="og:image" content="${escape(config.url)}/assets/social.svg"><meta name="twitter:card" content="summary"><link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${prefix}assets/style.css?v=${styleVersion}"><script src="${prefix}assets/site.js" defer></script></head>
<body><a class="skip" href="#main">Đến nội dung chính</a><header class="header wrap"><a class="brand" href="${prefix}" aria-label="${escape(config.name)} — Trang chủ"><span class="brand-icon">f<span>↗</span></span>${escape(config.name)}</a><nav aria-label="Điều hướng chính"><a href="${prefix}#nang-luc">Năng lực</a><a href="${prefix}#cach-tiep-can">Cách làm việc</a><details class="products-menu"><summary>Sản phẩm <span aria-hidden="true">⌄</span></summary><div class="products-dropdown"><a href="${prefix}projects/">Tất cả sản phẩm <span>↗</span></a>${projects.map(p => `<a href="${prefix}projects/${p.slug}/">${p.name}</a>`).join('')}</div></details><a class="nav-contact" href="#lien-he">Liên hệ <span>↗</span></a></nav></header>
<main id="main">${body}${contact(prefix)}</main><footer class="footer wrap"><a class="brand small" href="${prefix}">${escape(config.name)}</a><p>Phần mềm từ ý tưởng đến ứng dụng.</p><a href="${escape(config.github)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><span>© ${new Date().getFullYear()} ${escape(config.name)}</span></footer></body></html>`;
}

function card(p, prefix = './') {
  return `<article class="project-card" data-category="${p.category}"><a class="art-link" href="${prefix}projects/${p.slug}/" aria-label="Khám phá ${p.name}">${art(p)}<span class="art-open">↗</span></a><div class="project-info"><span class="project-number">/${p.number}</span><div><p class="eyebrow">${p.type}</p><h3><a href="${prefix}projects/${p.slug}/">${p.name}</a></h3><p>${p.description}</p><div class="tags">${p.tech.map(t => `<span>${t}</span>`).join('')}</div></div><a class="circle-link" href="${prefix}projects/${p.slug}/" aria-label="Đọc về ${p.name}">↗</a></div></article>`;
}

const capabilities = [
  ['01', 'Phân tích & kiến trúc', 'Biến yêu cầu nghiệp vụ thành thiết kế có thể triển khai.', 'Phân tích quy trình, thiết kế dữ liệu, API và ranh giới dịch vụ. Lựa chọn kiến trúc theo phạm vi, tích hợp và hướng phát triển của hệ thống.', 'System analysis · API design · Modular architecture'],
  ['02', 'Phần mềm doanh nghiệp', 'Kết nối công việc trong một hệ thống thống nhất.', 'Ứng dụng quản lý, ERP, đào tạo, nhân sự và bán hàng; nền tảng web đa vai trò, phân quyền và tích hợp các hệ thống hiện có.', '.NET · Java · React · Next.js · SQL'],
  ['03', 'Backend & dữ liệu', 'Tổ chức luồng xử lý từ dữ liệu đến ứng dụng.', 'Xây dựng API, hàng đợi tác vụ, tìm kiếm và phân tích hành vi. Kết hợp lưu trữ, cache và cập nhật thời gian thực theo đặc thù nghiệp vụ.', 'Go · Python · Kafka · Redis · OpenSearch'],
  ['04', 'AI, tự động hóa & media', 'Đưa công nghệ vào từng bước của quy trình.', 'Tích hợp nhận dạng giọng nói, phụ đề, dịch và tổng hợp giọng đọc; tự động hóa tác vụ và phát triển các thành phần cho hệ thống video, OTT.', 'Python · FFmpeg · AI integration · Streaming'],
  ['05', 'Desktop & công cụ dữ liệu', 'Công cụ chuyên biệt cho công việc chuyên sâu.', 'Phát triển ứng dụng desktop, giao diện thao tác dữ liệu, SQL editor và thành phần dùng chung; tổ chức connector theo kiến trúc plugin.', 'C++ · Qt · SQL · Plugin architecture'],
  ['06', 'IoT & hạ tầng triển khai', 'Kết nối thiết bị với hệ thống vận hành.', 'Thu thập thông số, xử lý dữ liệu thiết bị và cung cấp API giám sát. Tổ chức môi trường triển khai, logging và theo dõi dịch vụ trên hạ tầng cloud.', 'MQTT · Modbus · Docker · Kubernetes · AWS / GCP'],
];
const home = `<section class="hero wrap company-hero"><div class="hero-top"><p class="eyebrow"><span class="green-dot"></span> FOTECHV / GIẢI PHÁP CÔNG NGHỆ</p><span class="edition">PHÂN TÍCH → THIẾT KẾ → PHÁT TRIỂN</span></div><h1>Công nghệ phù hợp.<br>Vận hành <span class="serif">hiệu quả.</span></h1><div class="hero-bottom"><p>FOTECHV phân tích, thiết kế và phát triển phần mềm theo nhu cầu thực tế. Kết nối nghiệp vụ, dữ liệu và công nghệ để xây dựng giải pháp cho vận hành và phát triển doanh nghiệp.</p><div class="hero-actions"><a class="button dark" href="#nang-luc">Khám phá năng lực <span>↘</span></a><a class="text-link" href="#lien-he">Trao đổi nhu cầu ↗</a></div></div><div class="solution-map" aria-label="Phạm vi giải pháp"><span class="map-label">TỪ BÀI TOÁN<br>ĐẾN GIẢI PHÁP</span><div><b>01</b><span>Phần mềm<br>doanh nghiệp</span></div><div><b>02</b><span>Dữ liệu &<br>tự động hóa</span></div><div><b>03</b><span>Thiết bị &<br>hệ thống kết nối</span></div><a href="#giai-phap" aria-label="Xem các bài toán có thể triển khai">↓</a></div></section>
<section class="needs wrap" id="giai-phap"><div class="section-heading"><div><p class="eyebrow">01 / GIẢI PHÁP</p><h2>Bắt đầu từ công việc<br>cần giải quyết.</h2></div><p>Từ một quy trình cụ thể<br>đến một nền tảng nhiều thành phần.</p></div><div class="needs-grid"><article><span>VẬN HÀNH</span><h3>Số hóa quy trình quản lý</h3><p>Tập trung dữ liệu và công việc lên ứng dụng phù hợp với vai trò, quy trình và mô hình tổ chức.</p></article><article><span>NĂNG SUẤT</span><h3>Tự động hóa tác vụ</h3><p>Kết nối các bước xử lý, tích hợp AI và theo dõi tiến trình qua công cụ vận hành tập trung.</p></article><article><span>KẾT NỐI</span><h3>Khai thác dữ liệu hệ thống</h3><p>Tích hợp phần mềm, thu thập dữ liệu thiết bị và xây dựng giao diện tra cứu, phân tích, giám sát.</p></article></div></section>
<section class="capabilities" id="nang-luc"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">02 / NĂNG LỰC CHUYÊN MÔN</p><h2>Hiểu nghiệp vụ.<br>Đi sâu vào kỹ thuật.</h2></div><p>Phân tích, kiến trúc và phát triển<br>trong cùng một hướng giải quyết.</p></div><div class="capability-grid">${capabilities.map(([n,title,lead,description,tech]) => `<article><span class="cap-number">/${n}</span><h3>${title}</h3><p class="cap-lead">${lead}</p><p>${description}</p><div class="cap-tech">${tech}</div></article>`).join('')}</div></div></section>
<section class="experience wrap"><div class="section-heading"><div><p class="eyebrow">03 / KINH NGHIỆM THEO LĨNH VỰC</p><h2>Tiếp cận từng lĩnh vực<br>từ đặc thù vận hành.</h2></div><p>Nền tảng chuyên môn từ kinh nghiệm<br>phát triển, kiến trúc và quản lý dự án.</p></div><div class="domain-list"><div><h3>Doanh nghiệp & thương mại</h3><p>ERP, nhân sự, bán hàng, đặt dịch vụ, bán vé sự kiện và tích hợp dữ liệu giữa các hệ thống.</p></div><div><h3>Giáo dục & đào tạo</h3><p>Quản lý đào tạo, eLearning, nền tảng trung tâm và các thành phần phục vụ lớp học trực tuyến.</p></div><div><h3>Truyền thông & nội dung số</h3><p>OTT, truyền hình, video streaming và quy trình xử lý nội dung đa ngôn ngữ.</p></div><div><h3>Dữ liệu & thiết bị kết nối</h3><p>Phân tích hành vi, khám phá dữ liệu, mô phỏng và thu thập thông số thiết bị qua MQTT, Modbus.</p></div></div></section>
<section class="approach" id="cach-tiep-can"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">04 / CÁCH LÀM VIỆC</p><h2>Rõ bài toán.<br>Rõ phạm vi triển khai.</h2></div><p>Kết nối yêu cầu nghiệp vụ với kỹ thuật<br>và tổ chức công việc theo từng giai đoạn.</p></div><div class="principles"><div><span>01 — KHẢO SÁT & ĐỀ XUẤT</span><h3>Thống nhất điều cần làm.</h3><p>Làm rõ người dùng, quy trình, dữ liệu và các ràng buộc. Xác định phạm vi, ưu tiên và hướng giải pháp.</p></div><div><span>02 — THIẾT KẾ & PHÁT TRIỂN</span><h3>Cụ thể hóa từng phần.</h3><p>Thiết kế kiến trúc và giao diện, phát triển theo giai đoạn, trao đổi phản hồi để hoàn thiện chức năng.</p></div><div><span>03 — BÀN GIAO & HỖ TRỢ</span><h3>Chuẩn bị cho sử dụng.</h3><p>Kiểm tra theo yêu cầu đã thống nhất, chuẩn bị triển khai, tài liệu và hỗ trợ theo phạm vi hợp tác.</p></div></div></div></section>
<section class="evidence wrap" id="du-an"><div class="section-heading"><div><p class="eyebrow">05 / SẢN PHẨM & GIẢI PHÁP</p><h2>Năng lực qua những<br>hệ thống đã phát triển.</h2></div><a class="text-link" href="./projects/">Xem tất cả sản phẩm ↗</a></div><div class="evidence-grid">${projects.map(p => `<a href="./projects/${p.slug}/"><span class="eyebrow">${p.label}</span><h3>${p.name} <span>↗</span></h3><p>${p.description}</p></a>`).join('')}</div></section>`;
const projectIndex = `<section class="catalog-hero wrap"><a class="back" href="../">← Trang chủ</a><p class="eyebrow">FOTECHV / SẢN PHẨM & GIẢI PHÁP</p><h1>Từ bài toán<br>đến <span class="serif">sản phẩm.</span></h1><p>Khám phá chức năng, kiến trúc và vai trò của công nghệ trong từng dự án.</p></section>
<section class="work wrap" id="du-an"><div class="section-heading"><div><p class="eyebrow">01 / DỰ ÁN TIÊU BIỂU</p><h2>Những điều đã xây dựng<span class="count">(${projectCount})</span></h2></div><p>Mỗi dự án, một bài toán.<br>Mỗi công nghệ, một vai trò.</p></div><div class="filters" role="group" aria-label="Lọc dự án" hidden><button type="button" class="active" data-filter="all" aria-pressed="true">Tất cả <span>${projectCount}</span></button><button type="button" data-filter="web" aria-pressed="false">Web application</button><button type="button" data-filter="ai" aria-pressed="false">AI & tự động hóa</button><button type="button" data-filter="desktop" aria-pressed="false">Desktop</button><button type="button" data-filter="simulation" aria-pressed="false">Dữ liệu & mô phỏng</button><button type="button" data-filter="iot" aria-pressed="false">IoT</button></div><p class="sr-only" id="filter-status" role="status" aria-live="polite"></p><div class="project-grid">${projects.map(p => card(p, '../')).join('')}</div></section>
`;

// Deliberately limited to the headings, paragraphs, bold text and tables used by these articles.
function renderArticle(markdown) {
  const lines = markdown.replace(/^\uFEFF/, '').replaceAll('\r', '').split('\n');
  const toc = []; let result = ''; let i = 0;
  const cells = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map(s => s.trim());
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line || line.startsWith('# ')) { i++; continue; }
    if (line.startsWith('## ')) {
      const label = line.slice(3); const id = `section-${toc.length + 1}`;
      toc.push({ label, id }); result += `<h2 id="${id}">${inline(label)}</h2>`; i++; continue;
    }
    if (line.startsWith('|')) {
      const headings = cells(line); i++;
      if (!/^\|[\s:|\-]+\|$/.test(lines[i]?.trim() || '')) throw new Error('Invalid Markdown table');
      i++; let rows = '';
      while (i < lines.length && lines[i].trim().startsWith('|')) { rows += `<tr>${cells(lines[i++]).map(c => `<td>${inline(c)}</td>`).join('')}</tr>`; }
      result += `<div class="table-scroll" role="region" aria-label="Công nghệ sử dụng" tabindex="0"><table><thead><tr>${headings.map(h => `<th scope="col">${inline(h)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`; continue;
    }
    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith('## ') && !lines[i].startsWith('|')) paragraph.push(lines[i++].trim());
    result += `<p>${inline(paragraph.join(' '))}</p>`;
  }
  return { html: result, toc };
}

await mkdir(path.join(out, 'assets'), { recursive: true });
await cp(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
await writeFile(path.join(out, 'index.html'), layout({ title: 'Giải pháp phần mềm, dữ liệu & tự động hóa', description: config.description, body: home }));
await mkdir(path.join(out, 'projects'), { recursive: true });
await writeFile(path.join(out, 'projects', 'index.html'), layout({ title: 'Sản phẩm & giải pháp', description: 'Các sản phẩm và giải pháp về phần mềm doanh nghiệp, AI, dữ liệu, desktop và IoT của FOTECHV.', prefix: '../', canonical: 'projects/', body: projectIndex }));
for (const p of projects) {
  const { html, toc } = renderArticle(await readFile(path.join(root, 'content/projects', `${p.slug}.md`), 'utf8'));
  const body = `<section class="project-hero wrap"><a class="back" href="../">← Tất cả dự án</a><p class="eyebrow">DỰ ÁN / ${p.number} — ${p.type}</p><h1>${p.name}</h1><p class="project-lead">${p.title.replace('\n', ' ')}</p><div class="tags">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>${art(p)}</section><div class="article-layout wrap"><aside class="article-aside"><p class="eyebrow">TRONG BÀI VIẾT</p><nav aria-label="Mục lục bài viết">${toc.map(t => `<a href="#${t.id}">${escape(t.label)}</a>`).join('')}</nav><a class="aside-contact" href="#lien-he">Trao đổi về dự án ↗</a></aside><article class="prose" aria-label="Giới thiệu ${p.name}">${html}</article></div><section class="more-projects wrap"><p class="eyebrow">TIẾP TỤC KHÁM PHÁ</p><div>${projects.filter(x => x !== p).map(x => `<a href="../${x.slug}/"><span>${x.label}</span><h2>${x.name} ↗</h2></a>`).join('')}</div></section>`;
  await mkdir(path.join(out, 'projects', p.slug), { recursive: true });
  await writeFile(path.join(out, 'projects', p.slug, 'index.html'), layout({ title: p.name, description: p.description, prefix: '../../', canonical: `projects/${p.slug}/`, kind: 'article', body }));
}
await writeFile(path.join(out, '404.html'), layout({ title: 'Không tìm thấy trang', description: 'Trang bạn tìm không tồn tại.', prefix: '/', body: '<section class="wrap not-found"><p class="eyebrow">404 / KHÔNG TÌM THẤY TRANG</p><h1>Một lối rẽ khác.</h1><p>Trang này không tồn tại hoặc đã đổi địa chỉ.</p><a class="button dark" href="/">Về trang chủ ↗</a></section>' }));
await writeFile(path.join(out, '.nojekyll'), '');
await writeFile(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.url}/sitemap.xml\n`);
await writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['', 'projects/', ...projects.map(p => `projects/${p.slug}/`)].map(p => `<url><loc>${escape(config.url + '/' + p)}</loc></url>`).join('')}</urlset>`);
console.log(`Built homepage, ${projects.length} project articles, 404 and SEO files in dist/`);
