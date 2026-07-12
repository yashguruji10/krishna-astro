import { dbConnect } from './dbConnect';
import SiteSettings from '@/models/SiteSettings';

const DEFAULTS = {
  _id: 'site',
  siteName: 'Jay Durga Jyotish',
  logo: 'https://www.jaydurgajyotish.com/images/header/logo_web.png',
  favicon: 'https://www.jaydurgajyotish.com/images/header/logo_web.png',
  contact: {
    phone: '+91 94268 93180',
    whatsappNumber: '919426893180',
    email: 'yashguruji10@gmail.com',
    address: {
      en: 'Gita Nagar Society, Gas Circle, Adajan Road, Surat - 395009, Gujarat, India',
      hi: 'गीता नगर सोसाइटी, गैस सर्कल, अडाजण रोड, सूरत - 395009, गुजरात, भारत',
      gu: 'ગીતા નગર સોસાયટી, ગેસ સર્કલ, અડાજણ રોડ, સુરત - 395009, ગુજરાત, ભારત'
    },
    mapEmbedUrl: 'https://www.google.com/maps?q=Gas+Circle+Adajan+Road+Surat+Gujarat+395009+India&output=embed'
  },
  social: { facebook: 'https://www.facebook.com/Jay-Durga-Jyotish-109424814153040', instagram: '', youtube: '', twitter: '' },
  home: {
    heroTitle: {
      en: 'Jay Durga Jyotish',
      hi: 'जय दुर्गा ज्योतिष',
      gu: 'જય દુર્ગા જ્યોતિષ'
    },
    heroSubtitle: {
      en: 'Trusted Indian Astrologer for Love, Marriage, Career and Life Solutions',
      hi: 'प्रेम, विवाह, करियर और जीवन की समस्याओं के लिए विश्वसनीय भारतीय ज्योतिषी',
      gu: 'પ્રેમ, લગ્ન, કારકિર્દી અને જીવનની સમસ્યાઓ માટે વિશ્વસનીય ભારતીય જ્યોતિષી'
    },
    heroImage: 'https://www.jaydurgajyotish.com/images/header/gayatri_maa.png',
    heroSlides: [
      { image: 'https://www.jaydurgajyotish.com/images/content/services/love_marriage.jpg', caption: { en: 'Love Marriage Specialist', hi: 'लव मैरिज स्पेशलिस्ट', gu: 'લવ મેરેજ સ્પેશિયાલિસ્ટ' } },
      { image: 'https://www.jaydurgajyotish.com/images/content/services/horoscope_reading.jpg', caption: { en: 'Horoscope Reading', hi: 'कुंडली वाचन', gu: 'કુંડળી વાંચન' } },
      { image: 'https://www.jaydurgajyotish.com/images/content/services/all_puja.png', caption: { en: 'All Goddess Puja', hi: 'सभी देवी पूजा', gu: 'તમામ દેવી પૂજા' } },
      { image: 'https://www.jaydurgajyotish.com/images/content/services/vashikaran.jpg', caption: { en: 'Vashikaran Expert', hi: 'वशीकरण विशेषज्ञ', gu: 'વશીકરણ નિષ્ણાત' } },
      { image: 'https://www.jaydurgajyotish.com/images/content/services/black_magic.png', caption: { en: 'Black Magic Removal', hi: 'काला जादू निवारण', gu: 'કાળા જાદુ નિવારણ' } }
    ],
    astrologerSection: {
      title: { en: 'Meet Famous Indian Astrologer', hi: 'प्रसिद्ध भारतीय ज्योतिषी से मिलें', gu: 'પ્રખ્યાત ભારતીય જ્યોતિષીને મળો' },
      subtitle: { en: 'Best Astrology Services in USA, Canada and UK', hi: 'यूएसए, कनाडा और यूके में सर्वश्रेष्ठ ज्योतिष सेवाएं', gu: 'યુએસએ, કેનેડા અને યુકેમાં શ્રેષ્ઠ જ્યોતિષ સેવાઓ' },
      image: 'https://www.jaydurgajyotish.com/images/content/kashiram.png',
      content: {
        en: '<p>Astrologer Jay Durga Jyotish is famous across India, the USA, Canada and the UK for his accurate predictions and effective remedies. He provides guidance on Hast Rekha (palm reading), business problems, family disputes, marriage delays, love problems, santan prapti, gemstone recommendations, career guidance and horoscope reading.</p><p>He is also widely known as a Black Magic Specialist and Vashikaran expert, helping clients find lasting solutions and renewed peace of mind. If you wish to know your future or resolve any problem through astrology, contact him without hesitation.</p>',
        hi: '<p>ज्योतिषी जय दुर्गा ज्योतिष अपनी सटीक भविष्यवाणियों और प्रभावी उपायों के लिए भारत, अमेरिका, कनाडा और यूके में प्रसिद्ध हैं। वे हस्त रेखा वाचन, व्यापार समस्याओं, परिवारिक विवादों, विवाह में देरी, प्रेम समस्याओं, संतान प्राप्ति, रत्न सुझाव, करियर मार्गदर्शन और कुंडली वाचन पर मार्गदर्शन प्रदान करते हैं।</p><p>वे काला जादू विशेषज्ञ और वशीकरण विशेषज्ञ के रूप में भी जाने जाते हैं। यदि आप अपना भविष्य जानना चाहते हैं या ज्योतिष के माध्यम से किसी समस्या का समाधान चाहते हैं, तो बिना संकोच संपर्क करें।</p>',
        gu: '<p>જ્યોતિષી જય દુર્ગા જ્યોતિષ તેમની સચોટ ભવિષ્યવાણીઓ અને અસરકારક ઉપાયો માટે ભારત, અમેરિકા, કેનેડા અને યુકેમાં પ્રખ્યાત છે. તેઓ હસ્ત રેખા વાંચન, વ્યવસાય સમસ્યાઓ, પારિવારિક વિવાદો, લગ્નમાં વિલંબ, પ્રેમ સમસ્યાઓ, સંતાન પ્રાપ્તિ, રત્ન સૂચનો, કારકિર્દી માર્ગદર્શન અને કુંડળી વાંચન પર માર્ગદર્શન આપે છે.</p><p>તેઓ કાળા જાદુ નિષ્ણાત અને વશીકરણ નિષ્ણાત તરીકે પણ જાણીતા છે. જો તમે ભવિષ્ય જાણવા માંગતા હોવ અથવા કોઈ સમસ્યાનું નિરાકરણ ઇચ્છતા હોવ, સંકોચ વિના સંપર્ક કરો.</p>'
      }
    },
    aboutShort: {
      en: '<p>Astrologer Jay Durga Jyotish is recognized as one of the leading Indian astrologers serving clients across India, the USA, Canada and the UK. With knowledge passed down through generations of his family, he offers guidance on love, marriage, career, business, health and family matters using authentic Vedic astrology, horoscope reading, vashikaran and remedial pujas.</p><p>Known for his expertise in Hast Rekha (palm reading), horoscope matching and removing negative energy or black magic effects, he has helped thousands of people find peace, clarity and solutions to long-standing problems.</p>',
      hi: '<p>ज्योतिषी जय दुर्गा ज्योतिष भारत, अमेरिका, कनाडा और यूके में अग्रणी भारतीय ज्योतिषियों में से एक माने जाते हैं। परिवार की पीढ़ियों से प्राप्त ज्ञान के साथ, वे प्रेम, विवाह, करियर, व्यापार, स्वास्थ्य और परिवार से संबंधित मामलों पर प्रामाणिक वैदिक ज्योतिष, कुंडली वाचन, वशीकरण और उपाय पूजा के माध्यम से मार्गदर्शन प्रदान करते हैं।</p><p>हस्त रेखा वाचन, कुंडली मिलान और काले जादू व नकारात्मक ऊर्जा के निवारण में विशेषज्ञता के लिए जाने जाने वाले, उन्होंने हजारों लोगों को शांति, स्पष्टता और लंबे समय से चली आ रही समस्याओं का समाधान खोजने में मदद की है।</p>',
      gu: '<p>જ્યોતિષી જય દુર્ગા જ્યોતિષ ભારત, અમેરિકા, કેનેડા અને યુકેમાં અગ્રણી ભારતીય જ્યોતિષીઓમાંના એક ગણાય છે. પરિવારની પેઢીઓથી મળેલા જ્ઞાન સાથે, તેઓ પ્રેમ, લગ્ન, કારકિર્દી, વ્યવસાય, સ્વાસ્થ્ય અને પારિવારિક બાબતો પર અસલ વૈદિક જ્યોતિષ, કુંડળી વાંચન, વશીકરણ અને ઉપાય પૂજા દ્વારા માર્ગદર્શન આપે છે.</p><p>હસ્ત રેખા વાંચન, કુંડળી મેચિંગ અને કાળા જાદુ તથા નકારાત્મક ઊર્જાના નિવારણમાં નિપુણતા માટે જાણીતા, તેમણે હજારો લોકોને શાંતિ, સ્પષ્ટતા અને લાંબા સમયથી ચાલતી સમસ્યાઓના ઉકેલ શોધવામાં મદદ કરી છે.</p>'
    },
    branches: [
      {
        name: { en: 'Bardoli — Shastri Nagar', hi: 'બારડોલી — શાસ્ત્રી નગર', gu: 'બારડોલી — શાસ્ત્રી નગર' },
        address: {
          en: '12, Shastri Nagar, Mahatma Gandhi Rd, Beside IDBI Bank, Bardoli, Gujarat - 394601',
          hi: '12, शास्त्री नगर, महात्मा गांधी रोड, आईडीबीआई बैंक के पास, बारडोली, गुजरात - 394601',
          gu: '12, શાસ્ત્રી નગર, મહાત્મા ગાંધી રોડ, આઈડીબીઆઈ બેંકની બાજુમાં, બારડોલી, ગુજરાત - 394601'
        },
        mapEmbedUrl: 'https://maps.google.com/maps?q=21.126239,73.105859&z=16&output=embed&iwloc=near'
      },
      {
        name: { en: 'Surat — Gita Nagar', hi: 'सूरत — गीता नगर', gu: 'સુરત — ગીતા નગર' },
        address: {
          en: 'Gita Nagar Society, Gas Circle, Adajan Road, Surat, Gujarat - 395009',
          hi: 'गीता नगर सोसाइटी, गैस सर्कल, अडाजण रोड, सूरत, गुजरात - 395009',
          gu: 'ગીતા નગર સોસાયટી, ગેસ સર્કલ, અડાજણ રોડ, સુરત, ગુજરાત - 395009'
        },
        mapEmbedUrl: 'https://maps.google.com/maps?q=21.194895,72.802407&z=16&output=embed&iwloc=near'
      },
      {
        name: { en: 'Bardoli — Patidarjin', hi: 'बारडोली — पाटीदारजीन', gu: 'બારડોલી — પાટીદારજીન' },
        address: {
          en: 'Arpit Bafna Society, Patidarjin, Bardoli, Gujarat - 394601',
          hi: 'अर्पित बाफना सोसाइटी, पाटीदारजीन, बारडोली, गुजरात - 394601',
          gu: 'અર્પિત બાફના સોસાયટી, પાટીદારજીન, બારડોલી, ગુજરાત - 394601'
        },
        mapEmbedUrl: 'https://maps.google.com/maps?q=21.129308,73.105304&z=16&output=embed&iwloc=near'
      }
    ]
  },
  aboutPage: {
    title: { en: 'About Us', hi: 'हमारे बारे में', gu: 'અમારા વિશે' },
    content: {
      en: '<p>Astrologer Jay Durga Jyotish is regarded as one of the best Indian astrologers serving clients in the USA, Canada, the UK and across India. He brings expertise across many areas of life including education, career, business, finances, love and marriage disputes, and horoscope reading and matching. His knowledge has been passed down through generations of family astrologers, giving him deep roots in traditional Vedic practices alongside decades of practical consultation experience.</p><p>He has guided thousands of clients worldwide, combining inherited wisdom with continuous learning - regularly studying new techniques and attending astrology seminars internationally. Alongside horoscope reading and predictions, he is also known for his work in Vastu Shastra, telephonic consultations, and special pujas. As a devoted practitioner of Kali Mata worship, he performs daily pujas with sincerity and devotion, which he believes is a key source of his spiritual insight.</p><p>His areas of expertise include getting back lost love, spiritual healing, vashikaran remedies, and removal of black magic or negative energy. He approaches every client with patience and confidentiality, offering practical astrological remedies aimed at bringing more balance, prosperity and peace into their lives - whether the concern is about marriage, career, health, travel or finances.</p>',
      hi: '<p>ज्योतिषी जय दुर्गा ज्योतिष को अमेरिका, कनाडा, यूके और भारत भर में सेवा देने वाले सर्वश्रेष्ठ भारतीय ज्योतिषियों में से एक माना जाता है। वे शिक्षा, करियर, व्यापार, वित्त, प्रेम और विवाह विवाद, तथा कुंडली वाचन और मिलान सहित जीवन के कई क्षेत्रों में विशेषज्ञता रखते हैं। उनका ज्ञान परिवार की कई पीढ़ियों के ज्योतिषियों से प्राप्त हुआ है, जो उन्हें पारंपरिक वैदिक पद्धतियों में गहरी जड़ें और दशकों का व्यावहारिक अनुभव प्रदान करता है।</p><p>उन्होंने दुनिया भर के हजारों ग्राहकों का मार्गदर्शन किया है, विरासत में मिले ज्ञान को निरंतर सीखने के साथ जोड़ते हुए - नियमित रूप से नई तकनीकों का अध्ययन करते हैं और अंतरराष्ट्रीय ज्योतिष सेमिनारों में भाग लेते हैं। कुंडली वाचन और भविष्यवाणियों के साथ-साथ, वे वास्तु शास्त्र, टेलीफोनिक सलाह और विशेष पूजाओं के लिए भी जाने जाते हैं। काली माता के एक समर्पित उपासक के रूप में, वे प्रतिदिन निष्ठा और भक्ति के साथ पूजा करते हैं, जिसे वे अपनी आध्यात्मिक अंतर्दृष्टि का एक मुख्य स्रोत मानते हैं।</p><p>उनकी विशेषज्ञता के क्षेत्रों में खोया हुआ प्यार वापस पाना, आध्यात्मिक उपचार, वशीकरण उपाय, और काले जादू या नकारात्मक ऊर्जा का निवारण शामिल है। वे हर ग्राहक के साथ धैर्य और गोपनीयता के साथ व्यवहार करते हैं, व्यावहारिक ज्योतिषीय उपाय प्रदान करते हैं जिनका उद्देश्य उनके जीवन में अधिक संतुलन, समृद्धि और शांति लाना है - चाहे चिंता विवाह, करियर, स्वास्थ्य, यात्रा या वित्त के बारे में हो।</p>',
      gu: '<p>જ્યોતિષી જય દુર્ગા જ્યોતિષને અમેરિકા, કેનેડા, યુકે અને સમગ્ર ભારતમાં સેવા આપતા શ્રેષ્ઠ ભારતીય જ્યોતિષીઓમાંના એક ગણવામાં આવે છે. તેઓ શિક્ષણ, કારકિર્દી, વ્યવસાય, નાણાં, પ્રેમ અને લગ્ન વિવાદો, તથા કુંડળી વાંચન અને મેચિંગ સહિત જીવનના ઘણા ક્ષેત્રોમાં નિપુણતા ધરાવે છે. તેમનું જ્ઞાન પરિવારની ઘણી પેઢીઓના જ્યોતિષીઓ પાસેથી મળ્યું છે, જે તેમને પરંપરાગત વૈદિક પદ્ધતિઓમાં ગાઢ મૂળ અને દાયકાઓનો વ્યવહારુ અનુભવ આપે છે.</p><p>તેમણે વિશ્વભરના હજારો ગ્રાહકોને માર્ગદર્શન આપ્યું છે, વારસામાં મળેલા જ્ઞાનને નિરંતર શિક્ષણ સાથે જોડીને - નિયમિતપણે નવી તકનીકોનો અભ્યાસ કરે છે અને આંતરરાષ્ટ્રીય જ્યોતિષ સેમિનારોમાં ભાગ લે છે. કુંડળી વાંચન અને ભવિષ્યવાણીઓ ઉપરાંત, તેઓ વાસ્તુ શાસ્ત્ર, ટેલિફોનિક સલાહ અને ખાસ પૂજાઓ માટે પણ જાણીતા છે. કાલી માતાના સમર્પિત ઉપાસક તરીકે, તેઓ રોજ નિષ્ઠા અને ભક્તિ સાથે પૂજા કરે છે, જેને તેઓ તેમની આધ્યાત્મિક સમજનો મુખ્ય સ્ત્રોત માને છે.</p><p>તેમની નિપુણતાના ક્ષેત્રોમાં ગુમાવેલ પ્રેમ પાછો મેળવવો, આધ્યાત્મિક ઉપચાર, વશીકરણ ઉપાયો, અને કાળા જાદુ અથવા નકારાત્મક ઊર્જાનું નિવારણ શામેલ છે. તેઓ દરેક ગ્રાહક સાથે ધીરજ અને ગોપનીયતા સાથે વ્યવહાર કરે છે, વ્યવહારુ જ્યોતિષીય ઉપાયો પ્રદાન કરે છે જેનો હેતુ તેમના જીવનમાં વધુ સંતુલન, સમૃદ્ધિ અને શાંતિ લાવવાનો છે - ભલે ચિંતા લગ્ન, કારકિર્દી, સ્વાસ્થ્ય, મુસાફરી અથવા નાણાં વિશે હોય.</p>'
    },
    image: 'https://www.jaydurgajyotish.com/images/content/about_img.jpg'
  },
  countryPages: {
    usa: {
      enabled: true,
      title: { en: 'Astrology in USA', hi: 'यूएसए में ज्योतिष', gu: 'યુએસએમાં જ્યોતિષ' },
      content: {
        en: '<p>Jay Durga Jyotish is a well-known Indian astrologer serving clients across the USA. With years of experience in Vedic astrology, horoscope reading and Hast Rekha (palm reading), he has helped thousands of people in America find clarity and solutions for problems related to love, marriage, career, business, health and family life.</p><p>He is well known for solving problems such as love marriage obstacles, enemy and jealousy problems, marriage delays, black magic effects, depression, court case issues, money and career problems, relationship and husband-wife disputes, and addiction problems.</p><p>Clients across the USA can consult him in person, by phone, or by sending their queries online for a prompt and confidential response. By understanding the influence of planetary positions, he helps clients take timely, corrective action and find practical, time-tested astrological remedies.</p>',
        hi: '<p>जय दुर्गा ज्योतिष एक प्रसिद्ध भारतीय ज्योतिषी हैं जो पूरे अमेरिका (USA) में अपने ग्राहकों को सेवाएं देते हैं। वैदिक ज्योतिष, कुंडली वाचन और हस्त रेखा वाचन में वर्षों के अनुभव के साथ, उन्होंने अमेरिका में हजारों लोगों को प्रेम, विवाह, करियर, व्यापार, स्वास्थ्य और पारिवारिक जीवन से जुड़ी समस्याओं में स्पष्टता और समाधान पाने में मदद की है।</p><p>वे लव मैरिज की बाधाओं, शत्रु व ईर्ष्या की समस्याओं, विवाह में देरी, काले जादू के प्रभाव, अवसाद, कोर्ट केस, धन व करियर की समस्याओं, रिश्तों व पति-पत्नी के विवाद, तथा व्यसन जैसी समस्याओं को हल करने के लिए जाने जाते हैं।</p><p>अमेरिका भर के ग्राहक उनसे व्यक्तिगत रूप से, फोन पर, या ऑनलाइन अपने प्रश्न भेजकर शीघ्र और गोपनीय सलाह प्राप्त कर सकते हैं। ग्रहों की स्थिति के प्रभाव को समझकर, वे ग्राहकों को समय पर सही कदम उठाने और व्यावहारिक, समय-परीक्षित ज्योतिषीय उपाय अपनाने में मदद करते हैं।</p>',
        gu: '<p>જય દુર્ગા જ્યોતિષ એક જાણીતા ભારતીય જ્યોતિષી છે જે સમગ્ર અમેરિકા (USA) માં પોતાના ગ્રાહકોને સેવા આપે છે. વૈદિક જ્યોતિષ, કુંડળી વાંચન અને હસ્ત રેખા વાંચનમાં વર્ષોના અનુભવ સાથે, તેમણે અમેરિકામાં હજારો લોકોને પ્રેમ, લગ્ન, કારકિર્દી, વ્યવસાય, સ્વાસ્થ્ય અને પારિવારિક જીવન સંબંધિત સમસ્યાઓમાં સ્પષ્ટતા અને ઉકેલ મેળવવામાં મદદ કરી છે.</p><p>તેઓ લવ મેરેજની અડચણો, દુશ્મન અને ઈર્ષ્યાની સમસ્યાઓ, લગ્નમાં વિલંબ, કાળા જાદુની અસરો, ડિપ્રેશન, કોર્ટ કેસ, પૈસા અને કારકિર્દીની સમસ્યાઓ, સંબંધો અને પતિ-પત્નીના વિવાદો, તથા વ્યસનની સમસ્યાઓ ઉકેલવા માટે જાણીતા છે.</p><p>સમગ્ર અમેરિકાના ગ્રાહકો તેમને રૂબરૂ, ફોન પર, અથવા ઓનલાઇન પોતાના પ્રશ્નો મોકલીને ઝડપી અને ગોપનીય સલાહ મેળવી શકે છે. ગ્રહોની સ્થિતિની અસર સમજીને, તેઓ ગ્રાહકોને સમયસર યોગ્ય પગલાં લેવા અને વ્યવહારુ, સમય-ચકાસાયેલ જ્યોતિષીય ઉપાયો અપનાવવામાં મદદ કરે છે.</p>'
      },
      image: 'https://www.jaydurgajyotish.com/images/header/usa_img.png'
    },
    canada: {
      enabled: true,
      title: { en: 'Astrology in Canada', hi: 'कनाडा में ज्योतिष', gu: 'કેનેડામાં જ્યોતિષ' },
      content: {
        en: '<p>Jay Durga Jyotish is recognized as one of the best Indian astrologers serving clients across Canada. He studies the position of the celestial bodies and their impact on human life, and uses Vedic astrology together with Vastu Shastra to offer practical solutions and bring peace and prosperity into people\'s lives.</p><p>Every person faces different challenges, and a detailed horoscope analysis can offer clarity on questions such as career versus business, the right investment, children\'s education, marriage timing and improving one\'s financial situation.</p><p>Known for his friendly and down-to-earth approach, he is easy to reach for clients across Canada - whether in person or online - and provides his services at a reasonable price, making astrological guidance accessible to everyone who needs it.</p>',
        hi: '<p>जय दुर्गा ज्योतिष को कनाडा भर के ग्राहकों को सेवा देने वाले सर्वश्रेष्ठ भारतीय ज्योतिषियों में गिना जाता है। वे ग्रहों की स्थिति और मानव जीवन पर उनके प्रभाव का अध्ययन करते हैं, और वैदिक ज्योतिष के साथ वास्तु शास्त्र का उपयोग करके व्यावहारिक समाधान प्रदान करते हैं तथा लोगों के जीवन में शांति और समृद्धि लाते हैं।</p><p>हर व्यक्ति अलग-अलग चुनौतियों का सामना करता है, और एक विस्तृत कुंडली विश्लेषण करियर बनाम व्यापार, सही निवेश, बच्चों की शिक्षा, विवाह का सही समय और आर्थिक स्थिति सुधारने जैसे सवालों पर स्पष्टता दे सकता है।</p><p>अपने मित्रवत और सरल स्वभाव के लिए जाने जाने वाले, वे कनाडा भर के ग्राहकों के लिए आसानी से उपलब्ध हैं - चाहे व्यक्तिगत रूप से हो या ऑनलाइन - और उचित मूल्य पर अपनी सेवाएं प्रदान करते हैं, जिससे ज्योतिषीय मार्गदर्शन हर जरूरतमंद के लिए सुलभ हो जाता है।</p>',
        gu: '<p>જય દુર્ગા જ્યોતિષને સમગ્ર કેનેડામાં ગ્રાહકોને સેવા આપતા શ્રેષ્ઠ ભારતીય જ્યોતિષીઓમાં ગણવામાં આવે છે. તેઓ ગ્રહોની સ્થિતિ અને માનવ જીવન પર તેમની અસરનો અભ્યાસ કરે છે, અને વૈદિક જ્યોતિષ સાથે વાસ્તુ શાસ્ત્રનો ઉપયોગ કરીને વ્યવહારુ ઉકેલો આપે છે તથા લોકોના જીવનમાં શાંતિ અને સમૃદ્ધિ લાવે છે.</p><p>દરેક વ્યક્તિ અલગ-અલગ પડકારોનો સામનો કરે છે, અને વિગતવાર કુંડળી વિશ્લેષણ કારકિર્દી વિરુદ્ધ વ્યવસાય, યોગ્ય રોકાણ, બાળકોના શિક્ષણ, લગ્નનો યોગ્ય સમય અને આર્થિક સ્થિતિ સુધારવા જેવા પ્રશ્નો પર સ્પષ્ટતા આપી શકે છે.</p><p>પોતાના મૈત્રીપૂર્ણ અને સરળ સ્વભાવ માટે જાણીતા, તેઓ સમગ્ર કેનેડાના ગ્રાહકો માટે સરળતાથી ઉપલબ્ધ છે - પછી ભલે તે રૂબરૂ હોય કે ઓનલાઇન - અને વ્યાજબી ભાવે પોતાની સેવાઓ પ્રદાન કરે છે, જેથી જ્યોતિષીય માર્ગદર્શન દરેક જરૂરિયાતમંદ માટે સુલભ બને છે.</p>'
      },
      image: 'https://www.jaydurgajyotish.com/images/header/canada_img.png'
    },
    uk: {
      enabled: true,
      title: { en: 'Astrology in UK', hi: 'यूके में ज्योतिष', gu: 'યુકેમાં જ્યોતિષ' },
      content: {
        en: '<p>Jay Durga Jyotish is one of the renowned Indian astrologers in the UK, offering accurate solutions across a wide range of life concerns such as career, finance, investments, property, marriage and education. He carries out thorough research in astrology and shares his knowledge with new students of the field, while remaining available for consultation throughout the day.</p><p>Coming from a family where astrology runs in the blood, he learned this art from his ancestors at an early age and has the techniques to help people move past all kinds of difficult situations - including love and relationship issues, workplace challenges, and the astrological doshas that often go unnoticed.</p><p>Clients across the UK, regardless of background, are welcome to approach him online or in person for time-tested remedies rooted in thousands of years of Vedic tradition, with birth charts compared against present planetary positions to give precise guidance for the road ahead.</p>',
        hi: '<p>जय दुर्गा ज्योतिष यूके (UK) के प्रतिष्ठित भारतीय ज्योतिषियों में से एक हैं, जो करियर, वित्त, निवेश, संपत्ति, विवाह और शिक्षा जैसे जीवन के कई विषयों पर सटीक समाधान प्रदान करते हैं। वे ज्योतिष के क्षेत्र में गहन शोध करते हैं और नए विद्यार्थियों के साथ अपना ज्ञान साझा करते हैं, साथ ही पूरे दिन सलाह के लिए उपलब्ध रहते हैं।</p><p>एक ऐसे परिवार से आने वाले जिसमें ज्योतिष खून में बसा है, उन्होंने यह विद्या अपने पूर्वजों से कम उम्र में ही सीख ली थी और उनके पास प्रेम व रिश्तों की समस्याओं, कार्यस्थल की चुनौतियों, तथा अक्सर अनदेखे रह जाने वाले ज्योतिषीय दोषों जैसी हर तरह की कठिन परिस्थितियों से लोगों को उबारने की तकनीकें हैं।</p><p>यूके भर के ग्राहक, किसी भी पृष्ठभूमि के हों, हजारों वर्षों की वैदिक परंपरा में निहित समय-परीक्षित उपायों के लिए उनसे ऑनलाइन या व्यक्तिगत रूप से संपर्क कर सकते हैं, जहां जन्म कुंडली की वर्तमान ग्रह स्थिति से तुलना करके आगे की राह के लिए सटीक मार्गदर्शन दिया जाता है।</p>',
        gu: '<p>જય દુર્ગા જ્યોતિષ યુકે (UK) ના પ્રતિષ્ઠિત ભારતીય જ્યોતિષીઓમાંના એક છે, જે કારકિર્દી, નાણાં, રોકાણ, મિલકત, લગ્ન અને શિક્ષણ જેવા જીવનના અનેક વિષયો પર સચોટ ઉકેલો પ્રદાન કરે છે. તેઓ જ્યોતિષના ક્ષેત્રમાં ઊંડું સંશોધન કરે છે અને નવા વિદ્યાર્થીઓ સાથે પોતાનું જ્ઞાન વહેંચે છે, સાથે સાથે આખો દિવસ સલાહ માટે ઉપલબ્ધ રહે છે.</p><p>એવા પરિવારમાંથી આવતા જેમાં જ્યોતિષ લોહીમાં વણાયેલું છે, તેમણે આ વિદ્યા પોતાના પૂર્વજો પાસેથી નાની ઉંમરે જ શીખી લીધી હતી અને તેમની પાસે પ્રેમ અને સંબંધોની સમસ્યાઓ, કાર્યસ્થળના પડકારો, તથા ઘણી વખત ધ્યાન બહાર રહી જતા જ્યોતિષીય દોષો જેવી દરેક પ્રકારની મુશ્કેલ પરિસ્થિતિઓમાંથી લોકોને બહાર કાઢવાની તકનીકો છે.</p><p>યુકેભરના ગ્રાહકો, કોઈ પણ પૃષ્ઠભૂમિના હોય, હજારો વર્ષોની વૈદિક પરંપરામાં મૂળ ધરાવતા સમય-ચકાસાયેલ ઉપાયો માટે તેમનો ઓનલાઇન અથવા રૂબરૂ સંપર્ક કરી શકે છે, જ્યાં જન્મ કુંડળીની હાલની ગ્રહ સ્થિતિ સાથે સરખામણી કરીને આગળના માર્ગ માટે સચોટ માર્ગદર્શન આપવામાં આવે છે.</p>'
      },
      image: 'https://www.jaydurgajyotish.com/images/header/uk_img.png'
    }
  },
  termsPage: {
    title: { en: 'Terms & Conditions', hi: 'नियम और शर्तें', gu: 'નિયમો અને શરતો' },
    content: {
      en: '<p>By using this website and our services, you agree to the following terms and conditions. All astrology, vashikaran and remedy services are provided for guidance purposes based on traditional practices. Results may vary from person to person. We do not guarantee specific outcomes. Payments made for services/products are non-refundable once the service has commenced. Please contact us for any queries regarding these terms.</p>',
      hi: '<p>इस वेबसाइट और हमारी सेवाओं का उपयोग करके, आप निम्नलिखित नियमों और शर्तों से सहमत होते हैं। सभी ज्योतिष, वशीकरण और उपाय सेवाएं पारंपरिक पद्धतियों पर आधारित मार्गदर्शन के उद्देश्य से प्रदान की जाती हैं। परिणाम व्यक्ति-दर-व्यक्ति भिन्न हो सकते हैं। हम किसी विशेष परिणाम की गारंटी नहीं देते। सेवा शुरू होने के बाद किए गए भुगतान वापस नहीं किए जाएंगे।</p>',
      gu: '<p>આ વેબસાઇટ અને અમારી સેવાઓનો ઉપયોગ કરીને, તમે નીચેના નિયમો અને શરતો સાથે સંમત થાઓ છો. તમામ જ્યોતિષ, વશીકરણ અને ઉપાય સેવાઓ પરંપરાગત પદ્ધતિઓ પર આધારિત માર્ગદર્શન માટે પ્રદાન કરવામાં આવે છે. પરિણામો વ્યક્તિએ વ્યક્તિએ બદલાઈ શકે છે. અમે કોઈ ચોક્કસ પરિણામની ગેરંટી આપતા નથી. સેવા શરૂ થયા પછી કરેલી ચુકવણી પરત કરવામાં આવશે નહીં.</p>'
    }
  },
  privacyPage: {
    title: { en: 'Privacy Policy', hi: 'गोपनीयता नीति', gu: 'ગોપનીયતા નીતિ' },
    content: {
      en: '<p>We respect your privacy. Information submitted through our service request forms (name, email, phone, date of birth, etc.) is used solely to provide astrology consultation and contact you regarding your request. We do not sell or share your personal information with third parties. Your data is stored securely and used only for the purpose of providing our services.</p>',
      hi: '<p>हम आपकी गोपनीयता का सम्मान करते हैं। हमारे सेवा अनुरोध फॉर्म के माध्यम से प्रस्तुत जानकारी (नाम, ईमेल, फोन, जन्म तिथि आदि) का उपयोग केवल ज्योतिष परामर्श प्रदान करने और आपके अनुरोध के संबंध में संपर्क करने के लिए किया जाता है। हम आपकी व्यक्तिगत जानकारी किसी तीसरे पक्ष को नहीं बेचते या साझा नहीं करते।</p>',
      gu: '<p>અમે તમારી ગોપનીયતાનું સન્માન કરીએ છીએ. અમારા સેવા વિનંતી ફોર્મ દ્વારા સબમિટ કરેલી માહિતી (નામ, ઈમેલ, ફોન, જન્મ તારીખ વગેરે) નો ઉપયોગ માત્ર જ્યોતિષ સલાહ આપવા અને તમારી વિનંતી સંબંધે સંપર્ક કરવા માટે થાય છે. અમે તમારી વ્યક્તિગત માહિતી ત્રીજા પક્ષ સાથે વેચતા કે શેર કરતા નથી.</p>'
    }
  },
  footerText: {
    en: 'Jay Durga Jyotish - Bringing peace and solutions to your life through authentic Vedic astrology.',
    hi: 'जय दुर्गा ज्योतिष - प्रामाणिक वैदिक ज्योतिष के माध्यम से आपके जीवन में शांति और समाधान लाना।',
    gu: 'જય દુર્ગા જ્યોતિષ - અસલ વૈદિક જ્યોતિષ દ્વારા તમારા જીવનમાં શાંતિ અને ઉકેલ લાવવું.'
  }
};

export async function getSiteSettings() {
  await dbConnect();
  const { _id, ...defaultsWithoutId } = DEFAULTS;
  let settings = await SiteSettings.findOneAndUpdate(
    { _id: 'site' },
    { $setOnInsert: defaultsWithoutId },
    { new: true, upsert: true }
  ).lean();
  return settings;
}

export const SITE_SETTINGS_DEFAULTS = DEFAULTS;
