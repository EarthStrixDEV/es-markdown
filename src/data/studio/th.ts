import type { StudioStrings } from './types';

/*
 * Thai Studio strings — mirrors en.ts structurally 1:1.
 * Tone: สุภาพระดับกลาง ไม่ใช้ครับ/ค่ะ. Technical terms (prompt, agent, JSON,
 * Markdown, BPM, aspect ratio, CTA, stack, MVP, negative prompt ฯลฯ) stay in
 * English per Thai developer convention. The text guardrail/follow-ups reuse
 * the Thai Workspace set in i18n/th.ts.
 *
 * AUTHORED — PENDING P'EARTH CONTENT REVIEW: the media guardrail/follow-up
 * set and every per-type extra-field default below were authored by Min-Ju,
 * not supplied.
 */
export const studioTh: StudioStrings = {
  locale: 'th',

  common: {
    task: {
      label: 'งาน',
      placeholder: 'ต้องการให้ AI ทำอะไร เช่น "เขียน migration เพิ่มคอลัมน์ status ในตาราง orders"',
      def: 'ทำงานตามที่อธิบายไว้ในบริบทด้านล่าง แล้วส่งผลลัพธ์ที่เสร็จสมบูรณ์หนึ่งชิ้น ไม่ใช่แค่แผนว่าจะทำอย่างไร',
    },
    context: {
      label: 'บริบท',
      placeholder: 'ภูมิหลัง สถานะปัจจุบัน และเหตุผลที่งานนี้สำคัญ',
      def: 'ไม่มีภูมิหลังเพิ่มเติม ให้ทำงานจากข้อมูลที่ระบุไว้ตรงนี้เท่านั้น และลิสต์สมมติฐานที่จำเป็นต้องตั้งขึ้นเอง',
    },
    audience: {
      label: 'กลุ่มเป้าหมาย / บทบาท',
      placeholder: 'เช่น Senior backend engineer ที่กำลัง review PR',
      def: 'คนที่มีความสามารถแต่ไม่ใช่ผู้เชี่ยวชาญเฉพาะด้าน ต้องการผลลัพธ์ที่ชัดเจน ใช้งานได้จริง และไม่มีศัพท์เฉพาะเกินจำเป็น',
    },
    constraints: {
      label: 'ข้อจำกัด',
      placeholder: 'บรรทัดละหนึ่งข้อ เช่น "ห้ามเพิ่ม dependency ใหม่"',
      def: 'ทำเฉพาะในขอบเขตของงาน — ไม่เพิ่มฟีเจอร์ที่ไม่ได้ขอ\nเลือกวิธีที่เรียบง่ายที่สุดที่ใช้งานได้ครบ\nระบุสิ่งที่ตรวจสอบไม่ได้ให้ชัดเจน',
    },
    output: {
      label: 'ผลลัพธ์',
      placeholder: 'รูปแบบ โครงสร้าง และความยาวของผลลัพธ์',
      def: 'งานที่เสร็จสมบูรณ์หนึ่งชิ้น ตามด้วยหมายเหตุ 2–3 บรรทัดเรื่องการตัดสินใจหลักและสิ่งที่ยังค้างอยู่',
    },
    tone: {
      label: 'น้ำเสียง / สไตล์',
      placeholder: 'เช่น ตรงไปตรงมาและเชิงเทคนิค',
      def: 'ชัดเจน ตรงประเด็น และเป็นรูปธรรม — ไม่มีคำฟุ่มเฟือยหรือคำโอ้อวด',
    },
    examples: {
      label: 'ตัวอย่าง / อ้างอิง',
      placeholder: 'ตัวอย่าง ลิงก์ หรือสิ่งอ้างอิงที่ต้องการให้ตรงกัน',
      def: 'ไม่มีตัวอย่าง ให้ทำตาม best practice ทั่วไปของงานประเภทนี้ และบอกว่าเลือกใช้แนวทางไหน',
    },
  },

  types: {
    code: {
      label: 'Code',
      description: 'เขียน แก้ไข หรือ refactor โค้ดใน codebase ที่มีอยู่',
      fields: {
        language: {
          label: 'ภาษา / Stack',
          placeholder: 'เช่น TypeScript, Next.js 15, React 19',
          def: 'ดูภาษาจากโค้ดที่มีอยู่ ถ้าไม่มีโค้ดเลยให้ใช้ TypeScript และแจ้งให้ทราบ',
        },
        existingCode: {
          label: 'โค้ดที่มีอยู่',
          placeholder: 'วางโค้ดที่เกี่ยวข้องหรือ path ของไฟล์',
          def: 'ไม่มีโค้ดเดิม ให้เขียนโค้ดที่ใช้งานได้ในตัวเอง และระบุว่าควรวางไว้ตรงไหนในโปรเจกต์ทั่วไป',
        },
      },
    },
    'new-project': {
      label: 'โปรเจกต์ใหม่',
      description: 'ตั้งโครงแอปหรือ service ใหม่ตั้งแต่ศูนย์',
      fields: {
        stack: {
          label: 'Stack',
          placeholder: 'เช่น Next.js + Postgres + Prisma',
          def: 'แนะนำ stack กระแสหลักที่มีเอกสารดีหนึ่งชุดสำหรับโปรเจกต์นี้ พร้อมเหตุผล 2–3 บรรทัด',
        },
        scope: {
          label: 'ขอบเขต / ฟีเจอร์ MVP',
          placeholder: 'บรรทัดละหนึ่งฟีเจอร์',
          def: 'เฉพาะชุดฟีเจอร์ที่เล็กที่สุดที่ทำให้ use case หลักใช้งานได้ครบตั้งแต่ต้นจนจบ\nไม่มีระบบ auth, payment หรือ admin panel ถ้าไม่ได้ระบุไว้',
        },
        platform: {
          label: 'แพลตฟอร์มเป้าหมาย',
          placeholder: 'เช่น Web (เบราว์เซอร์ทั้ง desktop และมือถือ)',
          def: 'Web แบบ responsive รองรับเบราว์เซอร์ทั้ง desktop และมือถือ',
        },
      },
    },
    image: {
      label: 'ภาพ',
      description: 'เขียน prompt สำหรับเครื่องมือสร้างภาพ',
      fields: {
        aspectRatio: {
          label: 'Aspect ratio',
          placeholder: 'เช่น 16:9',
          def: '1:1',
        },
        visualStyle: {
          label: 'สไตล์ภาพ',
          placeholder: 'เช่น สีน้ำนุ่ม ๆ โทนสีหม่น',
          def: 'สมจริงแบบภาพถ่าย แสงธรรมชาติ โฟกัสคมชัดที่ตัวแบบ',
        },
        subject: {
          label: 'ตัวแบบ',
          placeholder: 'ใครหรืออะไรอยู่ในภาพ กำลังทำอะไร ที่ไหน',
          def: 'ใช้ตัวแบบตามที่ระบุในงาน วางไว้กลางภาพและให้อยู่ในเฟรมครบทั้งหมด',
        },
        negativePrompt: {
          label: 'Negative prompt',
          placeholder: 'สิ่งที่ต้องไม่ปรากฏในภาพ',
          def: 'text, watermark, logo, extra limbs, distorted hands, blurry, low resolution',
        },
      },
    },
    video: {
      label: 'วิดีโอ',
      description: 'เขียน prompt สำหรับเครื่องมือสร้างวิดีโอ',
      fields: {
        duration: {
          label: 'ความยาว',
          placeholder: 'เช่น 8 วินาที',
          def: '8 วินาที ถ่ายต่อเนื่องช็อตเดียว',
        },
        shot: {
          label: 'ช็อต / กล้อง',
          placeholder: 'เช่น ค่อย ๆ dolly-in ระดับสายตา เลนส์ 35mm',
          def: 'Medium shot ระดับสายตา ค่อย ๆ push-in อย่างนิ่งนวล ไม่มีการตัดต่อ',
        },
        visualStyle: {
          label: 'สไตล์',
          placeholder: 'เช่น Cinematic เกรดสี teal-orange',
          def: 'Cinematic แบบสมจริง เกรดสีธรรมชาติ แสงกลางวันนุ่ม ๆ',
        },
        aspectRatio: {
          label: 'Aspect ratio',
          placeholder: 'เช่น 9:16',
          def: '16:9',
        },
      },
    },
    audio: {
      label: 'เสียง / เสียงพูด',
      description: 'เสียงบรรยาย voice-over หรือ text-to-speech',
      fields: {
        voice: {
          label: 'ลักษณะเสียง',
          placeholder: 'เช่น ผู้บรรยายหญิงเสียงอบอุ่น อายุ 30 ปี สำเนียงกลาง',
          def: 'ผู้บรรยายวัยผู้ใหญ่ เสียงอบอุ่น สำเนียงกลาง',
        },
        script: {
          label: 'สคริปต์',
          placeholder: 'ข้อความที่ต้องพูดตามคำต่อคำ',
          def: 'ไม่มีสคริปต์ ให้เขียนสคริปต์สั้น ๆ จากงาน (อ่านออกเสียงไม่เกิน 60 วินาที) แล้วอ่านตามที่เขียนไว้',
        },
        pace: {
          label: 'จังหวะ / อารมณ์',
          placeholder: 'เช่น สงบ สดใสเล็กน้อย 150 คำต่อนาที',
          def: 'จังหวะปานกลาง (ประมาณ 150 คำต่อนาที) สงบและเป็นมิตร เว้นจังหวะสั้น ๆ ระหว่างประโยค',
        },
      },
    },
    music: {
      label: 'เพลง',
      description: 'เขียน prompt สำหรับเครื่องมือสร้างเพลง',
      fields: {
        genre: {
          label: 'แนวเพลง',
          placeholder: 'เช่น Lo-fi hip hop',
          def: 'Acoustic pop สมัยใหม่',
        },
        mood: {
          label: 'อารมณ์',
          placeholder: 'เช่น ชวนคิดถึง เปี่ยมความหวัง',
          def: 'อบอุ่นและชวนให้ใจฟู',
        },
        bpm: {
          label: 'BPM',
          placeholder: 'เช่น 90',
          def: '100',
        },
        vocals: {
          label: 'มีเสียงร้อง / บรรเลง',
          placeholder: 'เช่น เสียงร้องชาย หรือ บรรเลงล้วน',
          def: 'บรรเลงล้วน',
        },
        lyrics: {
          label: 'เนื้อเพลง',
          placeholder: 'เนื้อเพลง ถ้าเพลงมีเสียงร้อง',
          def: 'ไม่มี — เป็นเพลงบรรเลง',
        },
      },
    },
    'agent-task': {
      label: 'งานสำหรับ Agent',
      description: 'มอบหมายงานหลายขั้นตอนให้ agent ทำเองอัตโนมัติ',
      fields: {
        tools: {
          label: 'Tools ที่อนุญาต',
          placeholder: 'บรรทัดละหนึ่ง tool',
          def: 'อ่านไฟล์ใน working directory\nรัน shell command แบบ read-only\nห้ามเข้าถึง network และห้ามลบไฟล์',
        },
        stopConditions: {
          label: 'เงื่อนไขการหยุด',
          placeholder: 'เมื่อไรที่ agent ต้องหยุด บรรทัดละหนึ่งข้อ',
          def: 'งานเสร็จและตรวจสอบแล้ว\nขั้นตอนเดิมล้มเหลวสองครั้ง\nขั้นตอนถัดไปจะออกนอกขอบเขตที่ระบุไว้',
        },
        approvalPoints: {
          label: 'จุดที่ต้องขออนุมัติ',
          placeholder: 'การกระทำที่ต้องให้คนอนุมัติก่อน บรรทัดละหนึ่งข้อ',
          def: 'ก่อนลบหรือเขียนทับสิ่งใด\nก่อนทำสิ่งที่มีผลนอก workspace นี้ (push, deploy, ส่งข้อความ)\nก่อนติดตั้ง dependency ใหม่',
        },
      },
    },
    research: {
      label: 'ค้นคว้า',
      description: 'หาคำตอบของคำถามและรายงานสิ่งที่พบ',
      fields: {
        question: {
          label: 'คำถาม',
          placeholder: 'คำถามที่ต้องการคำตอบแบบเจาะจง',
          def: 'ตีความงานเป็นคำถามวิจัยข้อเดียว และสรุปคำถามนั้นใหม่ในหนึ่งประโยคก่อนเริ่ม',
        },
        sources: {
          label: 'แหล่งที่เชื่อถือได้',
          placeholder: 'บรรทัดละหนึ่งประเภทแหล่งข้อมูลหรือเว็บไซต์',
          def: 'เอกสารทางการและแหล่งข้อมูลปฐมภูมิมาก่อน\nงานที่ผ่าน peer review หรือถูกอ้างอิงอย่างกว้างขวาง\nอ้างอิงทุกข้อกล่าวอ้างพร้อมลิงก์ และทำเครื่องหมายสิ่งที่ไม่มีแหล่งที่มา',
        },
        depth: {
          label: 'ความลึก',
          placeholder: 'เช่น สำรวจคร่าว ๆ หรือ เจาะลึก',
          def: 'ภาพรวมแบบเจาะประเด็น: ข้อค้นพบหลัก ประเด็นที่เห็นต่างกันหลัก ๆ (ถ้ามี) และคำแนะนำหนึ่งย่อหน้า',
        },
      },
    },
    content: {
      label: 'คอนเทนต์',
      description: 'โพสต์ บทความ อีเมล และ copy',
      fields: {
        platform: {
          label: 'แพลตฟอร์ม',
          placeholder: 'เช่น LinkedIn, บล็อก, อีเมล newsletter',
          def: 'บทความบล็อกทั่วไปที่อ่านได้ทั้งบนเว็บและมือถือ',
        },
        length: {
          label: 'ความยาว',
          placeholder: 'เช่น 150 คำ',
          def: '300–500 คำ',
        },
        cta: {
          label: 'CTA',
          placeholder: 'ผู้อ่านควรทำอะไรต่อ',
          def: 'ปิดท้ายด้วยขั้นตอนถัดไปที่ชัดเจนหนึ่งอย่าง โดยไม่กดดันผู้อ่าน',
        },
      },
    },
    ideation: {
      label: 'ระดมไอเดีย',
      description: 'ระดมความคิดหาทางเลือกและไอเดีย',
      fields: {
        count: {
          label: 'จำนวนไอเดีย',
          placeholder: 'เช่น 10',
          def: '10',
        },
        novelty: {
          label: 'ระดับความแปลกใหม่',
          placeholder: 'ไอเดียควรปลอดภัยหรือแหวกแนวแค่ไหน',
          def: 'ผสมกัน: ราวครึ่งหนึ่งทำได้จริงตอนนี้ อีกครึ่งแหวกแนว ห้ามมีไอเดียที่ซ้ำกัน — แต่ละไอเดียต้องต่างกันที่แนวทาง ไม่ใช่แค่ถ้อยคำ',
        },
      },
    },
    other: {
      label: 'อื่น ๆ',
      description: 'งานประเภทอื่น — ใช้เฉพาะฟิลด์ทั่วไป',
      fields: {},
    },
  },

  guardrails: {
    text: {
      guardrail: {
        heading: 'ถ้าข้อมูลไม่พอ',
        body: 'ถ้าข้อมูลข้างบนไม่พอที่จะทำงานนี้ให้ดี ให้ถามกลับไม่เกิน 3 คำถามที่สำคัญที่สุดก่อน แล้วรอคำตอบ อย่าเดาแล้วทำต่อ สิ่งไหนที่ไม่มีข้อมูลรองรับ ให้บอกตรง ๆ ว่าไม่รู้ ห้ามแต่งขึ้นมา',
      },
      followUps: {
        heading: 'ข้อความต่อยอด',
        items: [
          'ร่างนี้กว้างเกินไป ให้เก็บเฉพาะส่วนที่ตอบเป้าหมายหลัก ตัดที่เหลือออก แล้วลิสต์สิ่งที่ตัดไปเพื่อให้ยืนยันได้ว่าไม่มีอะไรสำคัญหายไป',
          'คุณตั้งสมมติฐานที่ไม่เป็นความจริง: [ระบุตรงนี้] ให้แก้ให้ถูก ทำใหม่เฉพาะส่วนที่สมมติฐานนั้นกระทบ และชี้จุดอื่นที่พึ่งพาสมมติฐานเดียวกันด้วย',
          'ขอ section ที่อ่อนที่สุดมาอีก 2 เวอร์ชัน — แบบปลอดภัยกว่าหนึ่ง แบบกล้ากว่าหนึ่ง — พร้อมอธิบายหนึ่งบรรทัดว่าแต่ละเวอร์ชันแลกอะไรไป',
        ],
      },
    },
    /* AUTHORED — pending P'Earth content review. */
    media: {
      guardrail: {
        heading: 'กฎการสร้างผลงาน',
        body: 'ห้ามใส่ข้อความ คำบรรยาย โลโก้ หรือ watermark ถ้าไม่ได้ขอไว้ข้างบน รักษาตัวแบบให้คงเดิม — ตัวตน สี และรายละเอียดสำคัญเหมือนกัน — ในทุกผลลัพธ์และทุกครั้งที่แก้ ถ้ามีข้อกำหนดที่ขัดกัน ให้ยึดตามงานเป็นหลัก และบอกว่าตัดข้อไหนออก',
      },
      followUps: {
        heading: 'ข้อความต่อยอด',
        items: [
          'คงทุกอย่างไว้เหมือนเดิม แต่ทำให้ [ลักษณะ — เช่น ดราม่า มินิมอล อบอุ่น] มากขึ้น เปลี่ยนเฉพาะสิ่งที่จำเป็นเท่านั้น',
          'ใช้ตัวแบบและสไตล์เดิม แต่เปลี่ยนองค์ประกอบภาพ: [เช่น เฟรมกว้างขึ้น ตัวแบบไม่อยู่กลางภาพ มุมกล้องต่ำลง]',
          'ขอเวอร์ชันใหม่: ตัวแบบและโจทย์เดิม แต่ตีความ [องค์ประกอบหนึ่ง — เช่น แสง โทนสี การจัดวาง] ให้ต่างออกไปอย่างชัดเจน',
        ],
      },
    },
  },

  ui: {
    typeListTitle: 'ประเภท prompt',
    typeSwitchLocked: 'สร้างใหม่จากฟอร์มก่อน จึงจะเปลี่ยนประเภทได้',
    historyEmpty: 'ยังไม่มีรายการที่บันทึก — สร้าง prompt แล้วกดบันทึก',
    deleteEntryLabel: 'ลบ "{title}" ออกจากประวัติ',
    confirmDelete: 'ลบ "{title}" ออกจากประวัติใช่ไหม',
    confirmRegenerate:
      'สร้างผลลัพธ์ทั้งหมดใหม่จากฟอร์มใช่ไหม สิ่งที่แก้ไขในผลลัพธ์จะถูกเขียนทับ',
    lockedBanner: 'ผลลัพธ์ถูกแก้ไขแล้ว — ฟอร์มถูกล็อก',
    regenerate: 'สร้างใหม่จากฟอร์ม',
    formLabel: 'ฟอร์ม prompt ประเภท {type}',
    commonGroup: 'ทั่วไป',
    typeGroup: 'รายละเอียด {type}',
    formatTabsLabel: 'รูปแบบผลลัพธ์',
    formats: { plain: 'Plain', json: 'JSON', markdown: 'Markdown' },
    outputLabel: 'ผลลัพธ์แบบ {format}',
    stale: 'ไม่ตรงกับสิ่งที่แก้ไข',
    staleSr: '(ไม่ตรงกับสิ่งที่แก้ไข)',
    jsonErrorPrefix: 'JSON ไม่ถูกต้อง:',
    charCount: '{count} อักขระ',
  },
};
