// ================================================
//  AI 电商创作工作台 — 提示词词库 v2.0
//  真实女装提示词（docx爆款库）
//  真实男装提示词（PDF爆款库）
//  Gemini API 模型列表
// ================================================

// ==================== Gemini 可用模型 ====================
window.GEMINI_MODELS = [
  { group: '🖼 图像生成', models: [
    { id: 'models/gemini-3.1-flash-image',      name: 'Gemini 3.1 Flash Image (Nano Banana 2)',      desc: '推荐：质量、速度和成本均衡' },
    { id: 'models/gemini-3.1-flash-lite-image', name: 'Gemini 3.1 Flash Lite Image (Nano Banana 2 Lite)', desc: '低延迟、低成本' },
    { id: 'models/gemini-3-pro-image',          name: 'Gemini 3 Pro Image (Nano Banana Pro)',       desc: '专业级高质量图像' },
    { id: 'models/gemini-2.5-flash-image',      name: 'Gemini 2.5 Flash Image (Nano Banana)',       desc: '兼容旧版，快速生成' },
  ]},
  { group: '🎬 视频生成', models: [
    { id: 'models/gemini-omni-1.1-flash', name: 'Gemini Omni 1.1 Flash', desc: 'Google 当前推荐的视频生成模型' },
  ]},
  { group: '💬 通用对话 / 分析', models: [
    { id: 'models/gemini-3.8-flash',       name: 'Gemini 3.8 Flash',        desc: '当前通用分析与对话模型' },
    { id: 'models/gemini-2.5-pro',         name: 'Gemini 2.5 Pro',          desc: '复杂分析' },
    { id: 'models/gemini-2.5-flash',       name: 'Gemini 2.5 Flash',        desc: '高性能均衡' },
    { id: 'models/gemini-2.5-flash-lite',  name: 'Gemini 2.5 Flash-Lite',   desc: '轻量快速' },
  ]},
];

// ==================== 女装提示词模版（真实爆款库）====================
window.WOMEN_TEMPLATES = [
  {
    id: 'w_ins_foyer_selfie',
    name: 'INS风玄关对镜自拍',
    icon: '🪞',
    category: '对镜自拍',
    tip: '上传服装图，不露脸，手机遮面',
    ratio: '9:16',
    prompt: `Generate a realistic daily snapshot of a Chinese young woman taking a mirror selfie. The model must wear the exact clothing provided by the user, with the same color, material, texture, wrinkles, and silhouette, allowing no changes or reinterpretation. She stands in front of a floor-length mirror in a soft cream-toned, INS-style interior space, holding her phone up to take a selfie, with most of her face naturally covered by the phone. The camera framing is a close shot of the upper half of the body, with the model occupying about four-fifths of the frame, presented in a 9:16 aspect ratio.

Environment — INS cream-tone interior: Cream-colored walls with a warm recessed spotlight directly above her head. A black vintage wooden cabinet is placed on the left, decorated with dried flowers, scents, and small ornaments. The mirror has a rounded arch frame. The entire space looks clean, warm, and subtly upscale.

Lighting: The overhead spotlight must cast a natural, soft highlight on her hair and clothing. Fabric materials should show gentle, realistic light reflection. No harsh shadows, no overexposure, no artificial glow.

Hair: The model's hair must be long, dark brown, softly wavy, naturally voluminous, and tidy. Hair should appear smooth and well-kept. Shine must resemble real healthy hair under indoor lighting.

Overall Style: A natural, candid mirror-selfie moment with real-life imperfection. Relaxed pose, unposed energy, real indoor brightness. No dreamy glow, no cinematic softness, no distortion.`,
    negative: `Incorrect clothing details, color shifts, fabric deformation, plastic skin, overexposure, underexposure, flat lighting, AI artifacts, distorted background, mirror errors, elongated body proportions, unrealistic sheen`,
  },
  {
    id: 'w_warm_bedroom',
    name: '暖光卧室他拍',
    icon: '🛏',
    category: '室内场景',
    tip: '上传服装图 + 人脸图，露脸暖色卧室',
    ratio: '3:4',
    prompt: `Generate a realistic fashion portrait of a young Asian female model standing in a cozy bedroom. The model must wear the exact clothing provided by the user, with the same color, material, texture, wrinkles, and silhouette, allowing no changes or reinterpretation.

She stands facing the viewer with a gentle, confident posture, one hand lightly raised near her shoulder in a natural gesture. Her expression is sweet and soft, with a faint smile, looking directly at the camera. Medium shot from the thighs up, ensuring the outfit is the visual focus. Proportion should be completely natural, realistic, and not overly elongated.

Environment — INS warm-tone bedroom: White vintage-style dresser on the left with warm table lamp. Behind her is an ornate mirror mounted on the wall and cream-colored curtains. White leather armchair partially visible near a wardrobe. Clean, warm, inviting high-end home feel.

Lighting: Strong backlighting and rim lighting creating a glowing halo effect on her hair and shoulders. Face is softly lit with fill light, no harsh shadows. Fabric shows realistic warm ambient light interaction. No overexposure on face.

Hair: Styled in a high, slightly messy bun (updo). Loose strands illuminated by backlight creating a glowing, ethereal look. Soft, airy, natural texture. Dark brown color with realistic shine.

Overall Style: High-quality e-commerce fashion shot with warm, romantic atmosphere. Sharp focus on model and clothing, creamy soft bokeh on background. Photorealistic, 8k resolution, raw photo quality.`,
    negative: `Incorrect clothing details, color shifts, fabric deformation, plastic skin, overexposure, underexposure, flat lighting, AI artifacts, distorted background, extra fingers, missing fingers, bad anatomy, elongated body proportions, unrealistic sheen, cartoonish style`,
  },
  {
    id: 'w_black_fitting_room',
    name: '高级黑色试衣间对镜自拍',
    icon: '🖤',
    category: '对镜自拍',
    tip: '上传服装图 + 人脸图，露脸高端黑色风',
    ratio: '9:16',
    prompt: `Generate a realistic daily mirror selfie of a Chinese young woman posing in a high-end luxury walk-in closet or boutique store. The model must wear the exact clothing provided by the user, with the same color, material, texture, wrinkles, and silhouette, allowing no changes or reinterpretation.

She stands facing the mirror, taking a selfie with a dark smartphone held in her left hand. Head slightly tilted left, confident and elegant expression, eyes looking at the phone screen in the mirror. Right hand rests naturally on waist/hip to accentuate the body curve. Medium shot from thighs up, slender elegant proportion, fair-skinned "cold white skin".

Environment — Luxury Walk-in Closet: Sleek black finishes. Left: wall of black framed glass wardrobes with integrated vertical LED strip lighting. Right: glossy black island counter with reflective surface. Background: large illuminated backlit advertising board displaying a fashion poster. Upscale, clean, organized.

Lighting: Bright, cool-toned indoor artificial lighting. Overhead spotlights create high-contrast highlights on hair and glossy furniture. LED strips add linear modern lighting element. Flattering cosmetic lighting on face highlighting makeup details.

Hair & Makeup: Messy but chic high bun (updo). Sparkling pearl or rhinestone hair clip. Prominent earrings. Exquisite makeup: clear skin, reddish lipstick, defined eye makeup — "refined influencer" look.

Overall Style: Raw high-quality mirror selfie on iPhone 15 Pro. Clear skin texture, realistic human look, refusing "plastic" AI look. Xiaohongshu luxury lifestyle aesthetic. Sharp focus on face and upper body.`,
    negative: `(wearing a headband),(hat),messy background,warm yellow lighting,dark environment,studio lighting,incorrect clothing details,color shifts,fabric deformation,plastic skin,overexposure,underexposure,flat lighting,AI artifacts,distorted background,bad hands,missing fingers,extra fingers,elongated body proportions,anime,cartoon,3d render`,
  },
  {
    id: 'w_warm_mirror_selfie',
    name: '暖色系对镜自拍',
    icon: '🌸',
    category: '对镜自拍',
    tip: '上传服装图，不露脸，手机遮面，暖色INS',
    ratio: '9:16',
    prompt: `Generate a realistic daily snapshot of a Chinese young woman taking a mirror selfie. The model must wear the exact clothing provided by the user, with the same color, material, texture, wrinkles, and silhouette, allowing no changes or reinterpretation. She stands in front of a floor-length mirror in a soft cream-toned, INS-style interior space, holding her phone up to take a selfie, with most of her face naturally covered by the phone. Close shot of the upper half of the body, 9:16 aspect ratio, natural proportion.

Environment — INS cream-tone interior: Cream-colored walls with warm recessed spotlight above. Black vintage wooden cabinet on left with dried flowers and ornaments. Mirror with rounded arch frame. Dark door frame and soft reflective wall panel on right. Clean, warm, subtly upscale.

Lighting: Natural soft highlight on hair and clothing from overhead spotlight. Gentle realistic light reflection on fabric. No harsh shadows, no overexposure, no artificial glow. Clean, breathable, naturally lit image.

Hair: Long, dark brown, softly wavy, naturally voluminous and tidy. Smooth and well-kept. Realistic directional highlights from ceiling spotlight. Healthy hair shine — not oily, not plastic. Layered depth with light, shadows, and subtle gloss.

Overall Style: Natural candid mirror-selfie. Relaxed pose, unposed energy, real indoor brightness. No dreamy glow, no cinematic softness.`,
    negative: `Incorrect clothing details, color shifts, fabric deformation, plastic skin, overexposure, underexposure, flat lighting, AI artifacts, distorted background, mirror errors, elongated body proportions, unrealistic sheen`,
  },
  {
    id: 'w_indoor_fullbody_selfie',
    name: '室内全身对镜自拍',
    icon: '📱',
    category: '对镜自拍',
    tip: '上传服装图，不露脸，现代客厅全身',
    ratio: '9:16',
    prompt: `Generate a realistic full-body mirror selfie of a stylish young Asian woman. The model must wear the exact clothing provided by the user, with the same color, material, texture, wrinkles, and silhouette, allowing no changes or reinterpretation. She stands in a relaxed, casual pose, holding a modern smartphone in front of her face to take a mirror selfie. The phone covers the center of her face.

Environment — Modern living room with Single Ceiling Light: The ceiling reflected in the mirror features only one single round recessed downlight directly above, emitting a soft warm glow. Image framed by a distinct thick black arched mirror frame. Background reflection features a wall projection screen (slightly blurred), a sleek black cabinet with white roses, and a black lounge chair with a Hello Kitty plushie.

Lighting: Single Light Source from one ceiling downlight creating natural top-down lighting. No complex light arrays. Realistic fabric texture details. No harsh shadows, no overexposure.

Hair: Long, dark brown, styled in voluminous "wool roll" curls or deep waves. Falls naturally over shoulders. Soft and fluffy texture.

Overall Style: Trendy, clean OOTD snapshot. Real home environment authenticity. Photorealistic, 8k resolution.`,
    negative: `(multiple lights:1.6),(row of lights:1.6),(track lighting:1.5),(studio lights:1.5),(fingerprints:1.6),(smudges:1.6),(dirty mirror:1.5),(grey coat:1.5),(scarf:1.5),(crossbody bag:1.5),Incorrect clothing details,color shifts,fabric deformation,plastic skin,overexposure,underexposure,flat lighting,AI artifacts,mirror errors,elongated body proportions,bad hands,extra fingers,text,watermark,blur`,
  },
  {
    id: 'w_bright_street',
    name: '明亮街景（KPop风）',
    icon: '🏙',
    category: '街拍户外',
    tip: '上传服装图，AI生成KPop风模特',
    ratio: '3:4',
    prompt: `(kpop idol aesthetic:1.2), 1girl, solo, young asian woman, detailed beautiful face, (v-shaped face:1.1), (beauty mark on cheek:1.3), large expressive brown eyes, sharp cat-eye makeup, double eyelids, long eyelashes, (long wavy chestnut brown hair:1.2), center hair part, pale porcelain skin,

(looking back:1.3), from side, upper body, standing, hand raised near hair, dynamic turning pose, serious and cool expression, direct gaze,

background of a city street, asphalt road, modern white buildings, high-rise apartments, urban scenery, clear blue sky, bright natural sunlight, realistic shadows, depth of field, 8k resolution,

Strictly put the specified clothing on the model, forbidden to change.`,
    negative: `bad anatomy, bad hands, extra fingers, missing fingers, blurry, low quality, watermark, text, cartoon, 3d render, deformed face, ugly`,
  },
  {
    id: 'w_winter_street_gentle',
    name: '冬日街头温柔松弛感',
    icon: '☕',
    category: '街拍户外',
    tip: '上传服装图，AI生成日系街拍模特',
    ratio: '3:4',
    prompt: `(natural fresh beauty:1.4), 1girl, solo, young asian woman, (soft round face:1.3), (smooth porcelain skin:1.2),
(large clear almond eyes:1.2), (catchlights in eyes:1.6), (sparkling eyes:1.4), detailed iris, aegyo-sal,
(soft bright lighting on face:1.4), (face illuminated by soft daylight:1.3), (natural skin glow:1.2), (no shadows on face:1.3),
(random natural expression:1.2), (candid facial emotion), (looking at viewer or looking away), relaxed lips,
(long wavy black hair:1.7), (jet black hair:1.5), (korean hairstyle:1.4), (see-through bangs:1.4), (hair down:1.4), (no brown hair:1.6), (no dyed hair:1.5),
(natural lifestyle pose:1.3), (candid street snapshot:1.4), (leaning against a street pole:1.2), (holding a coffee cup:1.2), (dynamic body movement), (casual stance), unposed vibe,
(wearing white sneakers:1.3), (shoes on feet:1.4),
background of a busy city street corner, zebra crossing, asphalt road, traffic pole, overhead wires, (blurred background:1.5), (bokeh:1.3), (strong depth of field:1.4), (no text:1.3), urban citywalk,
Strictly put the specified clothing on the model, forbidden to change.`,
    negative: `bad anatomy, bad hands, extra fingers, missing fingers, blurry, low quality, watermark, text, cartoon, 3d render, plastic skin, heavy makeup, men, male`,
  },
  {
    id: 'w_fresh_garden',
    name: '清新元气风（花墙园林）',
    icon: '🌻',
    category: '街拍户外',
    tip: '上传服装图，AI生成清新甜美模特',
    ratio: '3:4',
    prompt: `(natural fresh beauty:1.3), 1girl, solo, young asian woman, (soft round face:1.1), (smooth porcelain skin:1.2),
(large clear almond eyes:1.2), (catchlights in eyes:1.5), (sparkling eyes:1.3), (reflection in eyes:1.2), detailed iris, aegyo-sal,
(bright sunshine smile:1.3), head tilted slightly to side, cute and sweet expression, (minimal natural makeup:1.2),
(long wavy black hair:1.3), (korean hairstyle:1.2), (voluminous hair:1.1), (see-through bangs:1.2), hair resting on shoulders,
(standing pose:1.2), (holding a small black camera with both hands:1.3), hands in front of waist, relaxed posture, upper body focus,
(wearing white sneakers:1.2), (shoes on feet:1.4),
background of a textured garden wall, (blooming orange trumpet creeper flowers:1.4), hanging green vines, lush greenery, stone brick wall base, cream upper wall, (bright direct sunlight:1.3), sharp shadow patterns, warm golden tones, summer freshness, depth of field,
Strictly put the specified clothing on the model, forbidden to change.`,
    negative: `bad anatomy, bad hands, extra fingers, missing fingers, blurry, low quality, watermark, text, cartoon, 3d render, serious face, dark background, indoor, male, man`,
  },
  {
    id: 'w_showroom_with_face',
    name: '室内橱窗带货（需人脸参考图）',
    icon: '🏬',
    category: '室内场景',
    tip: '上传服装图 + 人脸图，真人+假人商业展示',
    ratio: '3:4',
    prompt: `(shot on iPhone 15 Pro Max:1.3), (raw photo:1.2), masterpiece, photorealistic, 1girl, solo, asian, korean beauty, long dark brown hair, smiling, looking at viewer, standing, arms crossed, relaxed pose, standing next to a (headless mannequin:1.2) wearing same outfit, clothing store interior, indoor, floor-to-ceiling windows, natural daylight, soft shadows, realistic skin texture, high fashion street style, urban chic,

Strictly put the specified clothing on the model and mannequin, forbidden to change garment design or colors.`,
    negative: `(plastic skin:1.3),(airbrushed:1.3),(3d render:1.3),cartoon,anime,illustration,drawing,painting,cgi,makeup heavy,bad anatomy,bad hands,missing fingers,extra fingers,distorted mannequin,headless person,blur,bokeh,lowres,worst quality,grayscale`,
  },
  {
    id: 'w_ins_fitting_room',
    name: 'INS试衣间（露脸动态）',
    icon: '✨',
    category: '对镜自拍',
    tip: '上传服装图 + 人脸图，动态随机姿势',
    ratio: '9:16',
    prompt: `[POSE & ACTION - DYNAMIC & RANDOM]
Pose Style: Relaxed, candid, and fluid. The model is NOT standing stiffly. She has a natural "fashion blogger" vibe.
Random Action Generator: The pose should be randomly generated and varied. Examples:
- Subtly tilting her head to the side.
- Shifting her weight to one hip for a curved silhouette.
- One hand gently touching her hair or adjusting the collar/hem of the outfit.
- Looking down at the phone screen with a soft smile, or making eye contact with the mirror.
Constraint: The phone is held naturally to the side or chest. CRITICAL: The phone must NOT block her face.

[DEVICE - MINIMALIST]
Phone Case: Clean, solid-color minimalist phone case (Matte Black or White). NO patterns, NO dots, NO grips. Sleek and premium.

[SCENE & LIGHTING]
Environment: Minimalist fitting room, white wall, metal hook, beige carpet.
Lighting: Soft neutral indoor light.
Shadows: Realistic soft shadows of the model cast on the white wall.

[CLOTHING MANDATE]
Strictly follow the uploaded clothing image. Zero modifications.`,
    negative: `plastic skin, airbrushed, 3d render, cartoon, anime, bad anatomy, bad hands, missing fingers, extra fingers, blurry, low quality, watermark, text, open mouth showing teeth, stiff pose, symmetric stance`,
  },
  {
    id: 'w_mannequin_duo',
    name: '真人+假人对比展示',
    icon: '🪆',
    category: '电商基础',
    tip: '上传服装图，真人与假人同款对比',
    ratio: '3:4',
    prompt: `(masterpiece, best quality, ultra-detailed), realistic photo, 8k resolution,
[Composition]: (tight full body shot:1.5), (subjects filling the frame vertically:1.4), (minimal headroom:1.5), (feet visible:1.3), camera eye level,
[Height Difference]: (tall female mannequin standing next to petite girl:1.4), (mannequin is taller than girl:1.3),
[Environment]: inside a trendy clothing store, streetwear boutique, black shelves, vinyl records on shelf, magazines, wall decor, white electric guitar hanging on wall, floor-to-ceiling glass window, (snowing outside:1.3), winter street scene, falling snow, blurred pedestrians and cars,
[Lighting & Color]: (natural window light from right:1.4), cold winter daylight, soft shadows, volumetric lighting, cinematic lighting, indoor warm accent lighting, contrast between cool window light and dark interior,
[Subjects]: 2 females standing side by side,
[Human Model]: young asian woman, short black hair, bob cut, neutral expression, looking at viewer, pointing at the mannequin, (petite body:1.2),
[Mannequin Model]: (female mannequin:1.3), realistic face, stiff pose, standing straight, (tall stature:1.2),
[Clothing - MATCHING OUTFIT]: (both wearing exactly the same outfit:1.5),`,
    negative: `(too much headroom:1.5),(small subjects:1.5),(same height:1.4),(1boy,male,man:1.5),(different clothes:1.5),(worst quality,low quality:1.4),(knees cut off:1.4),(feet cut off:1.4),(head cut off:1.3),distant view,bad anatomy,bad hands,missing fingers,extra digit,text,watermark,blurry,(wrong clothing:1.5),overexposed,underexposed,distorted face`,
  },
];

// ==================== 男装提示词模版（真实爆款库）====================
window.MEN_TEMPLATES = [
  {
    id: 'm_white_bg',
    name: '电商白底幽灵图',
    icon: '🛍',
    category: '电商基础',
    tip: '仅需上传服装图，无需模特',
    ratio: '1:1',
    prompt: `Professional e-commerce product photography, (ghost mannequin effect:1.5), invisible mannequin shot. Full complete outfit assembled from reference image, posed naturally as if worn by an invisible body. [Form & Volume]: The clothing maintains full 3D volumetric shape and natural drape, floating in the air. (Hollow interior visible at neckline, cuffs, and waist:1.4), showing inside back collar label and inner fabric details flawlessly. [Texture & Details]: Premium fabric texture, realistic soft folds (not messy wrinkles), high-quality material rendering. All attached accessories are present in their correct worn positions. [Lighting & Background]: Isolated on pure white background. Soft studio lighting creating gentle volumetric shadows beneath and within the garments, giving depth. No human parts visible.`,
    negative: `human, person, model, hands, skin, hair, face, arms, background clutter, colored background`,
  },
  {
    id: 'm_warm_mirror_mask',
    name: '暖光室内对镜自拍（戴口罩）',
    icon: '🤳',
    category: '对镜自拍',
    tip: '上传服装图，口罩遮脸，无需人脸图',
    ratio: '9:16',
    prompt: `[Subject & Accessories] A handsome young Asian male model. He is wearing a black disposable face mask covering the lower half of his face, emphasizing his eyes.
[Action: Mirror Selfie] Mirror Selfie Shot. The model is facing a large full-length mirror in a fitting room or boutique store. He is holding a modern smartphone (iPhone Pro) up to take a picture of himself in the mirror.
Critical Pose Detail: The phone is held slightly to the side of his face (near the ear level), ensuring the chest area and collar are FULLY VISIBLE and not blocked by the phone. The other hand is casually in his pants pocket.
[Background & Environment] High-end fashion boutique background reflected in mirror. Blurred clothing racks, warm ambient lighting, and modern interior design behind him.
[Lighting] Realistic Mirror Reflection with subtle glass texture and slight reflection overlay. Soft and flattering lighting, highlighting the fabric texture. Forbidden to change garment design.`,
    negative: `(mouth visible:1.5),(nose visible:1.5),(no mask:1.5),(long hair:1.5),(feminine:1.5),(text),(watermark),(UI),(phone interface),(blurry),(distorted eyes)`,
  },
  {
    id: 'm_ins_mirror_mask',
    name: 'INS风对镜自拍（戴口罩）',
    icon: '📱',
    category: '对镜自拍',
    tip: '上传服装图，口罩遮脸，INS奶油风',
    ratio: '9:16',
    prompt: `Generate a realistic daily snapshot of a Chinese adult male model taking a mirror selfie. The model must wear the exact clothing provided by the user, with the same color, material, texture, wrinkles, and silhouette, allowing no changes or reinterpretation.
Body Stats: Height approximately 1.75m, weight 65kg, slim, fit, and natural build. Face Detail: He is wearing a plain black face mask that covers his nose and mouth properly.
He stands in front of a floor-length mirror in a soft cream-toned, INS-style interior space, holding his phone up to take a selfie. Close shot of the upper half of the body, 9:16 aspect ratio.

Environment — INS cream-tone interior: Cream-colored walls with a warm recessed spotlight directly above his head. A black vintage wooden cabinet on the left decorated with minimal scents and small ornaments. Mirror with rounded arch frame. The entire space looks clean, warm, and subtly upscale.

Lighting: Overhead spotlight casting natural, soft highlight on hair and clothing. Fabric shows gentle, realistic light reflection — subtle sheen on shoulders and chest. No harsh shadows, no overexposure, no artificial glow. Clean, breathable, naturally lit.

Hair (Male): Short, dark, neatly styled. Clean and well-kept. Ceiling spotlight creates realistic directional highlights on top of head.

Overall Style: Natural, candid mirror-selfie moment. Relaxed pose, unposed energy, real indoor brightness.`,
    negative: `(no mask:1.5),(mouth visible:1.5),(nose visible:1.5),(female:1.5),(woman:1.5),(long hair:1.5),(feminine features:1.5),(makeup:1.2),Incorrect clothing details,color shifts,fabric deformation,plastic skin,overexposure,underexposure,flat lighting,AI artifacts,distorted background,mirror errors,unrealistic sheen`,
  },
  {
    id: 'm_grey_luxury_mask',
    name: '高级灰室内对镜自拍（戴口罩）',
    icon: '🪞',
    category: '对镜自拍',
    tip: '上传服装图，口罩遮脸，高冷灰色调',
    ratio: '9:16',
    prompt: `[Subject & Identity Match] A handsome young Asian male model. He has short, textured black hair styled up (spiky cut). Thick, straight eyebrows and clear, bright eyes. Accessory: Wearing a sleek black face mask covering the lower half of his face. The contrast between pale skin and black mask highlights his eyes.
[Apparel] Wearing the user's specified garment — fabric with distinct texture. Wearing baggy black sweatpants.
[Action: Mirror Selfie] Mirror Selfie Shot. Standing in a luxury fitting room, holding a smartphone to take a photo in the full-length mirror.
Pose Control: The phone is held slightly to the side (near the ear), ensuring the chest area, the zipper, and the collar design are completely visible and NOT blocked.
[Environment] Background reflects grey velvet curtains and warm ambient lighting of a high-end boutique. Clean, expensive atmosphere.
[Lighting] Soft spotlight from above, creating shadows in the fabric texture of the shirt to show quality.
--ar 9:16 --style raw --v 6.0`,
    negative: `(mouth visible,nose visible,no mask,long hair,feminine,text,watermark,UI,phone interface,blurry,distorted eyes)`,
  },
  {
    id: 'm_elevator_mask',
    name: '电梯对镜自拍（戴口罩）',
    icon: '🏢',
    category: '对镜自拍',
    tip: '上传服装图，口罩遮脸，高端电梯场景',
    ratio: '9:16',
    prompt: `A full body shot of a man captured in a mirror selfie pose. He is wearing a black face mask. Standing naturally, holding an iPhone 15 Pro Max with one hand to take the photo, while his other hand is relaxed in his pocket. His eyes are looking at the phone screen, completely avoiding the camera lens. He looks busy checking his reflection for an OOTD shot.

Environment: Inside a modern high-end elevator. Walls made of brushed stainless steel and frosted glass. Bright, clean LED strip lighting from the ceiling. The mirror covers one entire wall, reflecting the sleek metallic interior.

Framing: Full body composition, strictly from head to toe, showing the entire figure including shoes and the floor. The camera captures the reflection in a large, clean floor-to-ceiling mirror.

Lighting & Style: Shot on iPhone 15 Pro Max, high-end mobile photography style. Realistic indoor lighting with a warm overhead spotlight creating natural shadows and highlights on the head and shoulders. Raw photo texture, highly detailed fabric and skin texture, realistic digital noise in shadows, no AI smoothing, no plastic skin.`,
    negative: `(looking at camera:1.6),(eye contact:1.6),two phones,portrait,half body,closeup,smiling,3d render,anime,CGI,perfect skin,deformed hands,blurry feet,cropped legs`,
  },
  {
    id: 'm_dark_studio_mask',
    name: '暗黑工作室（戴口罩）',
    icon: '🖤',
    category: '工作室',
    tip: '上传服装图，口罩遮脸，黑色工业风',
    ratio: '9:16',
    prompt: `Subject: A lean and toned Asian male model, fashion model physique, slender but athletic body shape, broad shoulders. (MANDATORY: Wearing a plain black face mask covering nose and mouth).
Pose: Full-body shot, standing naturally and confidently next to the display shelves, body slightly turned towards the camera, one hand in pocket or relaxed by the side, cool and trendy attitude.
Background (Cool Black Studio): A modern monochromatic all-black creative studio. Left Side: Black venetian blinds covering a window, creating linear shadows. Right Side: Tall black metal display shelves filled with lifestyle props: vinyl records, fashion books, a vintage camera, and headphones. Corner: A black acoustic guitar resting on the floor. Floor: Dark tiled floor.
Lighting: Cinematic lighting, soft daylight filtering through the black blinds from the left, highlighting the model's silhouette. Subtle shelf backlighting.
Style & Tech: Shot on iPhone 15 Pro Max, authentic mobile photography, raw photo, unedited, slight noise, ultra-realistic texture, deep depth of field, sharp details. Male model only, must wear mask, no mirror selfie, no phone in hand.`,
    negative: `(mannequin:1.6),(female:1.6),(two people:1.6),(pointing finger),(mirror selfie:1.5),(holding phone:1.5),(puffer jacket:1.5),(down coat:1.5),(text),(watermark),(messy cables),(bad hands),(distorted face)`,
  },
  {
    id: 'm_sitting_black_studio',
    name: '黑色系工作室坐姿',
    icon: '🪑',
    category: '工作室',
    tip: '上传服装图 + 人脸图，黑色工作室坐姿',
    ratio: '9:16',
    prompt: `Positive Prompt:
Subject: A fit athletic Asian male model, 1.80m tall, 75kg, broad shoulders. Handsome face, looking at the camera, confident smirk.
Pose & Action: Full body sitting shot. The model is sitting on a black industrial metal high-stool placed in the center. Legs: One foot is resting on the floor (extended forward), the other foot is hooked on the stool's footrest. This creates dynamism and layers. Hands: Resting naturally on his thighs or clasping hands together between knees.
Environment: (Same Cool Black Studio) Black blinds, black shelves behind him, guitar in corner.
Lighting: Cinematic mood lighting, highlighting the model on the stool.
Style: iPhone 15 Pro Max, f/8, eye-level or slightly low angle.`,
    negative: `(Crucial-Proportions):(short legs:1.8),(big head:1.8),(stubby body),(top-down view). (Crucial-Scene):(mask:1.5),(sunglasses),(mannequin:1.6),(female),(mirror selfie),(holding phone),(bad hands:1.6),(missing fingers). (General):(specific clothing patterns),(logos),(puffer jacket:1.5),DSLR,bokeh,illustration,cartoon`,
  },
  {
    id: 'm_night_street',
    name: '夜晚氛围感街拍',
    icon: '🌃',
    category: '街拍户外',
    tip: '上传服装图 + 人脸图，夜晚手机屏幕光',
    ratio: '9:16',
    prompt: `Generate a realistic night portrait of a handsome young Asian male model. The model must wear the exact clothing provided by the user, with the same color, material, texture, wrinkles, and silhouette, allowing no changes or reinterpretation.
Pose: Standing on a sidewalk at night, looking down at the smartphone held in his hand. One hand holds the phone, the other hand is down or in a pocket. Framing: Medium shot (waist up).
Environment — Night Roadside Sidewalk: Standing on a paved sidewalk next to a city road. Behind him, a metal guardrail separates the sidewalk from the main road. Background shows a dark asphalt road with yellow or white lane markings. Dark trees or bushes lining the other side of the road.
Lighting (Screen Light Effect): Key Light: The glow from the smartphone screen creates a soft, cool-toned light illuminating his face from below, highlighting his features while leaving the rest of the scene in shadow. High contrast night scene — face is bright, background is dark.
Hair: Thick, textured brown/black hair, styled with volume. Some strands appear slightly windblown.
Overall Style: Candid night street photography. Moody, atmospheric. Photorealistic, 8k resolution, raw photo quality.`,
    negative: `(middle of the road:1.5),(traffic danger:1.2),(daytime:1.5),(sunlight:1.5),(overhead light:1.5),Incorrect clothing details,color shifts,fabric deformation,plastic skin,overexposure,underexposure,flat lighting,AI artifacts,extra fingers,missing fingers,bad hands,text,watermark,blur`,
  },
  {
    id: 'm_autumn_cafe',
    name: '秋季咖啡厅工作',
    icon: '☕',
    category: '生活场景',
    tip: '上传服装图 + 人脸图，秋日文艺咖啡厅',
    ratio: '3:4',
    prompt: `Subject (The "Perfect Hanger" Model): A fit athletic Asian male model, 1.80m tall, 75kg, broad shoulders, narrow waist, long legs (V-taper physique). Handsome side profile, clear facial features, focused and calm expression, looking down at the laptop screen.
Pose & Action: Medium-to-Full shot (Sitting profile). The model is sitting comfortably on a brown leather sofa/booth next to a window. Left Hand: Resting on the keyboard of a laptop, typing or browsing. Right Hand: Raised near the mouth, holding a glass coffee cup (latte with layers), in the middle of taking a sip. Body: Slightly leaning forward towards the table, showing a relaxed working state.
Environment (Autumn Cafe Window): Foreground: A wooden cafe table with a silver open laptop and a hardcover book. Background: Large floor-to-ceiling glass window. Outdoor: Vibrant Autumn street scene with large trees with golden yellow leaves. Fallen leaves scattered on the ground. A blurred car is driving past in the background.
Lighting: Soft Side Light. Natural daylight entering from the window on the left. Warm and diffused autumn tone, highlighting the model's profile.
Photography Style: Shot on iPhone 15 Pro Max, mobile photography, raw candid photo, realistic skin texture, f/8 aperture, deep depth of field, no bokeh, no blur, high contrast, ultra-realistic, 4k.`,
    negative: `(bad hands:1.6),(missing fingers),(merged fingers),(cup merging with mouth),(floating cup),(spilling coffee),(DSLR bokeh:1.6),(blurred background),(studio lighting),(specific clothing patterns),(logos),Mask,face covering,illustration,3d render,cartoon,deformed body,bad anatomy`,
  },
  {
    id: 'm_snowy_cafe',
    name: '雪景咖啡厅工作（露脸）',
    icon: '❄️',
    category: '生活场景',
    tip: '上传服装图 + 人脸图，冬日雪景咖啡厅',
    ratio: '3:4',
    prompt: `Subject: A fit athletic Asian male model, 1.80m tall, 75kg, broad shoulders, handsome face, clear facial features, smooth skin, looking directly at the camera (eye contact), faint friendly smile.
Pose & Action: Medium shot (seated, knees up). The model is sitting on a wooden chair at a round wooden cafe table. Action: He is typing on a silver laptop (MacBook style) open on the table. Both hands are resting naturally on the keyboard.
Environment (Cafe Window & Snow): Background: A large floor-to-ceiling glass window of a coffee shop. Outdoor Scene: A snowy winter city street. Snow-covered trees, white snowy road, pedestrians walking in the distance, cold blue winter atmosphere. Indoor Scene: Minimalist cafe interior, black window frames. A coffee cup is visible on the edge of the table.
Lighting: Natural Backlight/Side Light. Large soft light source coming from the window behind the model. The model's face is evenly lit by the ambient reflection (no harsh shadows). Cool outdoor light mixes with neutral indoor light.
Photography Style: Shot on iPhone 15 Pro Max, mobile photography, raw candid photo, realistic skin texture, f/8 aperture, deep depth of field, no bokeh on face, high contrast, ultra-realistic, 4k.`,
    negative: `Mask,face covering,sunglasses,(bad hands:1.5),(missing fingers:1.5),(floating laptop),(screen glare),DSLR,bokeh,artistic blur,studio lighting,illustration,3d render,cartoon,anime,deformed body,bad anatomy,messy shadows,closed eyes,sleeping,messy table`,
  },
  {
    id: 'm_airport_walk',
    name: '机场出行街拍',
    icon: '✈️',
    category: '街拍户外',
    tip: '上传服装图 + 人脸图，机场动态街拍',
    ratio: '3:4',
    prompt: `(masterpiece,best quality,8k,raw photo,ultra-realistic),professional commercial fashion photography,airport fashion street snap,
(untucked shirt:1.5),(shirt hem hanging loose:1.3),(garment fully visible),(sleeves fully down),(no drawstrings at waist),(clean waistband),
(straight leg trousers:1.5),(loose fit hem:1.3),(trousers draping straight down to shoe:1.4),(hem just covering the instep),(clean straight silhouette),(no bunching),full body shot,
Subject: 1 male model, 178cm tall, 65kg, lean muscular build, (cold white translucent skin:1.3),
Face: (top tier asian influencer face:1.5),(refined delicate features),(glass skin texture),(subtle aegyosal),(high nose bridge),(soft gradient lips),clean shaven,(black hair with texture),
Eyes: (distinct catchlights in eyes:1.4),(bright reflection of window),(hyper-realistic iris texture),(moist eye surface),(looking ahead confidently),
Pose: (walking dynamically in airport terminal:1.3),(talking on smartphone:1.2),holding phone to ear,one hand in pocket,relaxed confident stride,
Background: (huge glass windows on left),(sunlight streaming in),(long diagonal shadows on floor:1.3),(blurred travelers in background),(blue airport signs in distance),modern architecture,
Lighting: (strong side sunlight:1.3),(high contrast shadows),(rim light on side of face),(catchlight in eyes),bright and airy atmosphere.`,
    negative: `(pants drawstrings:1.5),(sweatpants ties),(elastic waist),(joggers),(visible socks),(exposed ankles),(tucked in shirt),(rolled sleeves),(baggy clothes),(tiny subject),(far away shot),(low angle),blurry,flat lighting`,
  },
  {
    id: 'm_mountain_gold',
    name: '日照金山旅拍',
    icon: '🏔',
    category: '旅拍风景',
    tip: '上传服装图 + 人脸图，雪山黄金时刻',
    ratio: '3:4',
    prompt: `(best quality,masterpiece,ultra-high resolution:1.2),
handsome Chinese male model, approx 32 years old, clean-cut and refined facial features, short neat black hair, forehead exposed, (cold white skin tone:1.2),(matte skin finish:1.4),(non-shiny skin),gentle and warm eyes,friendly healing smile,trustworthy temperament,clean shaven,(Male,178cm,65kg,lean fit body),
(Attire Constraints: wearing the uploaded clothing image, natural fit, shirt untucked, hemline fully visible, no tucking, no rolled sleeves, fabric details visible),
(Action: sitting on the hood of a black luxury SUV, one leg resting on the car, hands resting naturally, looking into distance, heroic and calm posture),
(Background 1:1: majestic snow-capped mountain range, (golden sunrise light hitting mountain peak:1.3), Alpenglow effect, clear gradient blue sky, black Range Rover style car front in foreground, cold high-altitude atmosphere),
(Composition: Lower-center composition, subject centered in the bottom third, huge negative space of mountain and sky at top, eye-level shot, 35mm lens, f/5.6),
(Lighting: balanced exposure, (soft fill light on face:1.3), no harsh shadows on face, golden rim light on mountain, cool ambient shadow tones in foreground, high contrast background, velvet skin texture, commercial travel photography), 8k`,
    negative: `(oily skin:1.5),(shiny face:1.5),(specular highlights:1.4),(sweaty),(wet skin),(plastic skin),(greasy),(harsh shadows on face),(dark face),(tucked in shirt:1.5),(half tucked),(rolled up sleeves),(cropped head),(out of frame),(bad car structure),(distorted mountains)`,
  },
  {
    id: 'm_sea_view',
    name: '海边阳光蓝天',
    icon: '🌊',
    category: '旅拍风景',
    tip: '上传服装图 + 人脸图，海边清爽写真',
    ratio: '3:4',
    prompt: `(masterpiece,best quality,8k,raw photo,ultra-realistic),professional commercial fashion photography,outdoor street snap,seaside location,
(untucked shirt:1.5),(shirt hem hanging loose:1.3),(garment fully visible),(no zipper visible unless specified),(sleeves fully down),(no drawstrings at waist),
(straight leg trousers:1.5),(loose fit hem:1.3),(trousers draping straight down to shoe:1.4),(hem just covering the instep),(clean straight silhouette),(no bunching),full body shot,
Subject: 1 male model, 178cm tall, 65kg, lean muscular build, (cold white translucent skin:1.3),
Face: (top tier asian influencer face:1.5),(refined delicate features),(glass skin texture),(subtle aegyosal),(high nose bridge),(soft gradient lips),clean shaven,(black hair with texture),
Eyes: (distinct catchlights in eyes:1.4),(bright reflection of sea and sky),(hyper-realistic iris texture),(moist eye surface),(sunny gentle gaze looking at camera),
Pose: (standing on a seaside embankment:1.3),(one hand in pocket:1.2),other hand naturally by side,relaxed stance,facing forward,
Background: (calm blue sea surface),(distant islands and mountains),(blue sky with white cumulus clouds),(concrete pavement in foreground),bright sunny day,
Lighting: (enhanced natural sunlight:1.2),(direct sunlight),(hard shadows),(catchlight in eyes),high contrast,vibrant blue tones.`,
    negative: `(tiny subject:1.5),(far away shot),(wide landscape shot),(pants drawstrings:1.5),(sweatpants ties),(elastic waist),(joggers),(visible socks),(exposed ankles),(tucked in shirt),(rolled sleeves),(baggy clothes),(cropped head),(feet cutoff),(low angle),blurry,flat lighting`,
  },
  {
    id: 'm_bookstore',
    name: '书馆文艺风',
    icon: '📚',
    category: '生活场景',
    tip: '上传服装图 + 人脸图，书架背景文艺',
    ratio: '3:4',
    prompt: `(masterpiece,best quality,8k,raw photo,ultra-realistic),professional commercial fashion photography,indoor lifestyle shot,bookstore vibe,
(untucked shirt/sweater:1.5),(shirt hem hanging loose:1.3),(garment fully visible),(sleeves fully down),(no arms crossed),(chest visible),(no drawstrings at waist),(clean waistband),
(straight leg trousers:1.5),(loose fit hem:1.3),(trousers draping straight down to shoe:1.4),(hem just covering the instep),(clean straight silhouette),(no bunching),full body shot,
Subject: 1 male model, 178cm tall, 65kg, lean muscular build, (cold white translucent skin:1.3),
Face: (top tier asian influencer face:1.5),(refined delicate features),(glass skin texture),(subtle aegyosal),(high nose bridge),(soft gradient lips),clean shaven,(black hair with texture),(no glasses),
Eyes: (distinct catchlights in eyes:1.4),(bright reflection of library lights),(hyper-realistic iris texture),(moist eye surface),(smart gentle gaze looking at camera),
Pose: (leaning back against a tall wooden bookshelf:1.3),(hands in pockets:1.2),(arms relaxed by sides),legs crossed at ankles,relaxed stance,
Background: (tall wooden bookshelves filled with colorful books:1.3),(warm reading lamps in background),(blurred library aisle),intellectual atmosphere,
Lighting: (enhanced indoor lighting:1.2),(soft spotlight on face),(catchlight in eyes),(warm ambient light),(volumetric lighting),clear shadows.`,
    negative: `(arms crossed:1.5),(hiding chest),(wearing glasses),(eyewear),(pants drawstrings:1.5),(sweatpants ties),(elastic waist),(joggers),(visible socks),(exposed ankles),(tucked in shirt),(rolled sleeves),(baggy clothes),(tiny subject),(far away shot),(low angle),blurry,flat lighting,dark face`,
  },
  {
    id: 'm_motorcycle',
    name: '机车合影（工业风）',
    icon: '🏍',
    category: '街拍户外',
    tip: '上传服装图 + 人脸图，机车工业背景',
    ratio: '3:4',
    prompt: `(masterpiece,best quality,8k,raw photo,ultra-realistic),professional commercial fashion photography,outdoor street snap,industrial style,
(untucked shirt:1.5),(shirt hem hanging loose:1.3),(garment fully visible),(sleeves fully down),(no drawstrings at waist),(clean waistband),
(straight leg trousers:1.5),(loose fit hem:1.3),(trousers draping straight down to shoe:1.4),(hem just covering the instep),(clean straight silhouette),(no bunching),full body shot,
Subject: 1 male model, 178cm tall, 65kg, lean muscular build, (cold white translucent skin:1.3),
Face: (top tier asian influencer face:1.5),(refined delicate features),(glass skin texture),(subtle aegyosal),(high nose bridge),(soft gradient lips),clean shaven,(black hair with texture),
Eyes: (distinct catchlights in eyes:1.4),(bright reflection of sky),(hyper-realistic iris texture),(moist eye surface),(cool gaze looking to side),
Pose: (leaning back against a retro silver motorcycle:1.3),(one hand resting on thigh:1.2),(other hand holding a motorcycle helmet),relaxed confident stance,
Background: (rough grey concrete wall background:1.3),(silver retro motorcycle details),chrome engine parts,leather seat,industrial vibe,
Lighting: (soft overcast daylight:1.2),(diffused light),(metallic reflection on bike),(soft fill light on face),(catchlight in eyes),high contrast textures.`,
    negative: `(jeans tucked into boots:1.5),(visible boots shaft),(cuffed pants),(pants drawstrings),(sweatpants ties),(joggers),(visible socks),(exposed ankles),(tucked in shirt),(rolled sleeves),(baggy clothes),(tiny subject),(far away shot),(low angle),blurry,flat lighting`,
  },
  {
    id: 'm_forbidden_city',
    name: '故宫中式古建筑',
    icon: '🏯',
    category: '中式场景',
    tip: '上传服装图 + 人脸图，故宫高端氛围',
    ratio: '3:4',
    prompt: `(Full body shot of a 30-year-old sophisticated Asian man:1.2), 178cm tall, 65kg lean and athletic build, sharp jawline, (cold white skin:1.3). Calm and confident expression, looking into the distance with a refined temperament.
Composition: (Lower-third composition:1.6), subject positioned in the bottom-center grid, significant negative space above to emphasize the sky and architecture. Angle: Eye-level platform view, 35mm prime lens, strictly no low or high angles.
Background: 1:1 replica of the Forbidden City Corner Tower in Beijing, intricate traditional eaves, red wooden columns, ancient gray stone ramparts, a vast frozen moat with detailed ice textures and cracks, withered winter trees against a crisp blue sky.
Lighting: (Hard sunlight:1.2), enhanced cinematic contrast (+0.5 intensity), brilliant highlights and deep sculpted shadows, side-lighting to define the male physique and garment texture, no overexposure.
Outfit: Wearing the uploaded clothing, perfectly tailored silhouette, clean hemline, no tucking, showing high-end textile details.
Quality: 8k resolution, photorealistic, shot on Sony A7R5, 35mm f/1.8, extremely detailed skin pores and fabric fibers, professional color grading. --ar 3:4 --v 6.0`,
    negative: `blurry,low quality,cartoon,distorted,bad anatomy,watermark,text,female,woman,long hair,makeup`,
  },
  {
    id: 'm_dark_academia',
    name: '暗黑学院风（哥特建筑）',
    icon: '🏛',
    category: '高端场景',
    tip: '上传服装图 + 人脸图，哥特式建筑大片',
    ratio: '3:4',
    prompt: `(Full body shot:1.5),(The character occupies four-fifths of the frame height:1.6). A 30-year-old sophisticated Asian man, 178cm, 65kg, lean athletic physique, (cold white skin:1.3).
Pose: (Slightly angled body by 5 degrees:1.4), facing the camera with a very subtle turn to show silhouette depth, standing confidently on the green lawn.
Composition: (Strictly eye-level platform height:1.3), camera at chest level, 35mm focal length, no low-angle, no high-angle, no wide-angle distortion.
Background: 1:1 replica of the Gothic red brick manor, multiple dark gray pointed spires, intricate window frames, lush deep green forest in the background, vast green grass field with a low stone wall.
Lighting: (Soft cinematic daylight:1.3), enhanced light atmosphere (+0.5 intensity), refined contrast that defines the model's sharp facial features and the garment's slim-fit texture, no overexposure.
Outfit: Wearing the uploaded clothing, perfectly fitted, showing the full length of the outfit, clean hemline, no tucking.
Quality: 8k UHD, photorealistic, shot on Sony A7R5, 35mm lens, extreme detail on brick textures and skin pores. --ar 3:4 --v 6.0`,
    negative: `blurry,low quality,cartoon,distorted,bad anatomy,watermark,text,female,woman,short building,modern architecture`,
  },
  {
    id: 'm_hongkong_street',
    name: '香港街头风',
    icon: '🇭🇰',
    category: '街拍户外',
    tip: '上传服装图 + 人脸图，香港都市街拍',
    ratio: '9:16',
    prompt: `(Masterpiece-level quality, top-tier quality, 8K resolution, photorealistic, raw image texture, ultra-detailed, street snap),
A tall and slender young man (180cm model physique), wearing clear glasses. (Expression: CRITICAL - Closed mouth, no teeth, subtle cool expression, poker face, looking at camera). Short black hair with bangs.
Standing in a dynamic wide stance with legs far apart, right arm extended pointing outwards, left hand holding a drawstring bag low. wearing the user's specified clothing.

Background: Busy Hong Kong urban street scene. Ground: Asphalt road featuring large white painted warnings "LOOK RIGHT" and Chinese characters, yellow tactile paving on the sidewalk edge. Mid-ground: A white luxury MPV (Toyota Alphard style) parked on the side. Background: A bustling storefront with a red signboard reading "Cha Tra Mue", glass windows, warm indoor lighting. Stairs leading up in the distance, blurred pedestrians, urban city clutter.

Natural street daylight, overcast soft lighting, no hard shadows, sharp focus on the figure, realistic urban atmosphere.`,
    negative: `bad anatomy,bad hands,extra fingers,missing fingers,blurry,low quality,watermark,text,female,woman,long hair`,
  },
  {
    id: 'm_storyboard',
    name: '电影3格分镜（男女通用）',
    icon: '🎞',
    category: '创意特殊',
    tip: '上传一张人物图，选择4:3比例',
    ratio: '4:3',
    prompt: `Based on the attached reference image, generate a seamless composite image with an Aspect Ratio of 4:3.

⚠️ OUTFIT CONSISTENCY RULE (CRITICAL):
The character MUST wear the EXACT SAME OUTFIT in all three panels. NO changing clothes between panels.

⛔️ NO text, NO subtitles, NO black bars, NO borders, NO outfit changes, NO different clothes.

1. Character: Match attached face 1:1.
2. Panels (Stacked Vertically, Seamless):
* Top (Waist-up): Casual lifestyle pose — looking back or smiling
* Middle (Waist-up): Dynamic action moment — walking or interacting with environment
* Bottom (Waist-up): Walking forward or relaxed expression

Scene: Choose based on outfit mood — street, cafe, nature, indoor lifestyle, or travel destination.

Available scene themes:
- 海边·自由: Sunset ocean, wind blowing, white linen outfit
- 家里·温馨: Warm living room sunlight, beige oversized sweater
- 户外旷野: Green nature, mountains, wind, outdoor jacket
- 咖啡店·思考: Cafe interior, glass reflections, smart casual
- 下雨天·伤感: Rainy street, moody blue tones, black trench coat
- 企业奋斗: High-rise office, skyline, dark business suit
- 生活·人间烟火: Lively market, bright sun, casual white T-shirt
- 旅游·打卡: Tourist spot, sunny, colorful floral vacation shirt`,
    negative: `text,subtitles,black bars,borders,outfit changes,different clothes,watermark,logo,low quality`,
  },
];

// ==================== 通用视频提示词 ====================
window.VIDEO_PROMPTS = {
  motion: ['缓慢推进', '左右摇移', '环绕运动', '俯拍下降', '静态锁定', '手持轻抖'],
  duration: ['3秒', '5秒', '8秒', '10秒', '15秒'],
  fps: ['24fps 电影感', '30fps 标准', '60fps 流畅'],
  style: ['写实', '时尚大片', '广告级', '慢动作'],
};

// ==================== 动作模版 ====================
window.ACTION_TEMPLATES = [
  { id: 'walk_runway', name: '走秀步伐', icon: '👠', desc: '专业T台走秀' },
  { id: 'spin_show',   name: '旋转展示', icon: '🔄', desc: '360°服装展示' },
  { id: 'casual_walk', name: '休闲行走', icon: '🚶', desc: '自然日常步态' },
  { id: 'pose_stand',  name: '定格摆拍', icon: '📸', desc: '时尚杂志姿势' },
  { id: 'dynamic_jump',name: '活力跳跃', icon: '⚡', desc: '运动活力展示' },
  { id: 'sit_elegant', name: '优雅坐姿', icon: '🪑', desc: '坐姿优雅展示' },
];

// ==================== 数字人音色 ====================
window.DIGITAL_HUMAN_VOICES = [
  { id: 'zh_f_1', name: '小艾 · 甜美', gender: '女', style: '亲和力强' },
  { id: 'zh_f_2', name: '晓薇 · 知性', gender: '女', style: '专业解说' },
  { id: 'zh_f_3', name: '雅琳 · 优雅', gender: '女', style: '高端品牌感' },
  { id: 'zh_m_1', name: '浩宇 · 成熟', gender: '男', style: '品牌代言' },
  { id: 'zh_m_2', name: '志远 · 活力', gender: '男', style: '年轻活泼' },
];

