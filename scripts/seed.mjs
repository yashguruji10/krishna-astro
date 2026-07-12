/**
 * Seed script - run with: npm run seed
 *
 * Creates:
 * 1. The default admin account (from .env.local ADMIN_EMAIL / ADMIN_PASSWORD)
 * 2. A starter set of services/products based on the original Jay Durga Jyotish site
 * 3. Default site settings document
 *
 * Safe to re-run - it will not duplicate existing records.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@jaydurgajyotish.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme123';

const TranslatedString = {
  en: { type: String, default: '' },
  hi: { type: String, default: '' },
  gu: { type: String, default: '' }
};

const AdminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    passwordHash: String,
    role: { type: String, default: 'superadmin' }
  },
  { timestamps: true }
);

const ServiceSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, lowercase: true },
    title: TranslatedString,
    shortDescription: TranslatedString,
    description: TranslatedString,
    image: String,
    price: { type: Number, default: 0 },
    category: { type: String, default: 'service' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

// Loose schema on purpose: the real structure/validation lives in
// src/models/SiteSettings.js. This is only used here to insert the
// default document the first time the site is seeded. Registering it
// under the same model name ("SiteSettings") makes Mongoose derive the
// exact same collection name the app itself uses.
const SiteSettingsSchema = new mongoose.Schema({}, { strict: false, _id: false, timestamps: true });
const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);


const BASE_IMG = 'https://www.jaydurgajyotish.com/images/content/services';

const services = [
  {
    slug: 'love-marriage-specialist',
    title: { en: 'Love Marriage Specialist', hi: 'लव मैरिज स्पेशलिस्ट', gu: 'લવ મેરેજ સ્પેશિયાલિસ્ટ' },
    shortDescription: {
      en: 'Astrological remedies and vashikaran solutions to help couples unite in love marriage with family blessings.',
      hi: 'लव मैरिज में परिवार की सहमति पाने के लिए ज्योतिषीय उपाय और वशीकरण समाधान।',
      gu: 'લવ મેરેજમાં પરિવારની સંમતિ મેળવવા માટે જ્યોતિષીય ઉપાયો અને વશીકરણ ઉકેલો.'
    },
    description: {
      en: '<p>Love marriage problems are common but can be resolved effectively with the right guidance and timely remedies. Our astrologer specializes in solving the obstacles that prevent love marriages - whether caused by family opposition, caste differences, financial concerns, kundali dosh, or compatibility issues.</p><p>Using traditional Vedic astrology and vashikaran remedies passed down through generations, rituals and mantras are performed to remove astrological defects and help couples gain their family\'s approval and blessings. Many couples have been guided towards a successful and harmonious married life through these time-tested practices.</p><p>Every consultation is kept strictly confidential. If you are facing resistance to your love marriage due to family disagreements or other obstacles, get in touch for a personalized solution.</p>',
      hi: '<p>लव मैरिज की समस्याएं सामान्य हैं लेकिन सही मार्गदर्शन और समय पर किए गए उपायों से इन्हें प्रभावी ढंग से हल किया जा सकता है। हमारे ज्योतिषी परिवार के विरोध, जाति भेद, आर्थिक चिंताओं, कुंडली दोष या संगतता की समस्याओं के कारण लव मैरिज में आने वाली बाधाओं को दूर करने में विशेषज्ञ हैं।</p><p>पीढ़ियों से चली आ रही पारंपरिक वैदिक ज्योतिष और वशीकरण उपायों का उपयोग करके, ज्योतिषीय दोषों को दूर करने के लिए पूजा और मंत्र किए जाते हैं, जिससे जोड़ों को परिवार की सहमति और आशीर्वाद मिल सके।</p><p>हर सलाह पूरी तरह गोपनीय रखी जाती है। यदि आपकी लव मैरिज में परिवार के विरोध या अन्य बाधाओं का सामना है, तो व्यक्तिगत समाधान के लिए संपर्क करें।</p>',
      gu: '<p>લવ મેરેજની સમસ્યાઓ સામાન્ય છે પરંતુ યોગ્ય માર્ગદર્શન અને સમયસર ઉપાયોથી તેને અસરકારક રીતે હલ કરી શકાય છે. અમારા જ્યોતિષી પરિવારના વિરોધ, જાતિ ભેદ, આર્થિક ચિંતાઓ, કુંડળી દોષ અથવા સુસંગતતાની સમસ્યાઓને કારણે લવ મેરેજમાં આવતા અવરોધો દૂર કરવામાં નિષ્ણાત છે.</p><p>પેઢીઓથી ચાલતી પરંપરાગત વૈદિક જ્યોતિષ અને વશીકરણ ઉપાયોનો ઉપયોગ કરીને, જ્યોતિષીય દોષો દૂર કરવા માટે પૂજા અને મંત્રો કરવામાં આવે છે, જેથી જોડાંઓને પરિવારની સંમતિ અને આશીર્વાદ મળે.</p><p>દરેક સલાહ સંપૂર્ણ ગોપનીય રાખવામાં આવે છે. જો તમારા લવ મેરેજમાં પરિવારના વિરોધ અથવા અન્ય અવરોધોનો સામનો છે, તો વ્યક્તિગત ઉકેલ માટે સંપર્ક કરો.</p>'
    },
    image: `${BASE_IMG}/love_marriage.jpg`,
    category: 'service',
    order: 1
  },
  {
    slug: 'love-problem-solutions',
    title: { en: 'Love Problem Solutions', hi: 'लव प्रॉब्लम सॉल्यूशन', gu: 'લવ પ્રોબ્લેમ સોલ્યુશન' },
    shortDescription: {
      en: 'Effective remedies to resolve misunderstandings, breakups and bring back lost love.',
      hi: 'गलतफहमी, ब्रेकअप दूर करने और खोए हुए प्यार को वापस लाने के प्रभावी उपाय।',
      gu: 'ગેરસમજ, બ્રેકઅપ દૂર કરવા અને ગુમાવેલા પ્રેમને પાછો લાવવાના અસરકારક ઉપાયો.'
    },
    description: {
      en: '<p>Every relationship goes through difficult phases, but problems in love life should be addressed early before they grow into bigger issues. Our astrology-based remedies help resolve misunderstandings between partners, restore trust, and rebuild a healthy relationship grounded in Vedic principles.</p><p>If your relationship has hit a rough patch - whether due to family pressure, distance, communication gaps, or external interference - traditional rituals, mantras and pujas can help remove negative influences and improve harmony between you and your partner.</p><p>We also offer guidance for those looking to reconnect with an ex-partner through ethical, time-tested astrological techniques that work to remove obstacles and bring positive energy back into the relationship.</p>',
      hi: '<p>हर रिश्ता कठिन दौर से गुजरता है, लेकिन प्रेम जीवन की समस्याओं को बड़ा होने से पहले ही हल कर लेना चाहिए। हमारे ज्योतिष आधारित उपाय साझेदारों के बीच गलतफहमियों को दूर करने, विश्वास बहाल करने और वैदिक सिद्धांतों पर आधारित स्वस्थ संबंध बनाने में मदद करते हैं।</p><p>यदि आपका रिश्ता परिवार के दबाव, दूरी, संवाद की कमी या बाहरी हस्तक्षेप के कारण कठिन दौर से गुजर रहा है, तो पारंपरिक पूजा, मंत्र और उपाय नकारात्मक प्रभावों को दूर करने और आपके बीच सामंजस्य सुधारने में मदद कर सकते हैं।</p><p>हम पुराने साथी से दोबारा जुड़ने के इच्छुक लोगों के लिए भी नैतिक और समय-परीक्षित ज्योतिषीय तकनीकों के माध्यम से मार्गदर्शन प्रदान करते हैं।</p>',
      gu: '<p>દરેક સંબંધ મુશ્કેલ તબક્કાઓમાંથી પસાર થાય છે, પરંતુ પ્રેમ જીવનની સમસ્યાઓને મોટી થતા પહેલા જ ઉકેલવી જોઈએ. અમારા જ્યોતિષ આધારિત ઉપાયો ભાગીદારો વચ્ચે ગેરસમજ દૂર કરવા, વિશ્વાસ પુનઃસ્થાપિત કરવા અને વૈદિક સિદ્ધાંતો પર આધારિત તંદુરસ્ત સંબંધ બનાવવામાં મદદ કરે છે.</p><p>જો તમારો સંબંધ પરિવારના દબાણ, અંતર, સંવાદની ઉણપ અથવા બાહ્ય હસ્તક્ષેપને કારણે મુશ્કેલ તબક્કામાંથી પસાર થઈ રહ્યો છે, તો પરંપરાગત પૂજા, મંત્રો અને ઉપાયો નકારાત્મક પ્રભાવો દૂર કરવામાં અને તમારી વચ્ચે સંવાદિતા સુધારવામાં મદદ કરી શકે છે.</p><p>અમે જૂના સાથી સાથે ફરી જોડાવા ઈચ્છતા લોકો માટે પણ નૈતિક અને સમય-પરીક્ષિત જ્યોતિષીય તકનીકો દ્વારા માર્ગદર્શન આપીએ છીએ.</p>'
    },
    image: `${BASE_IMG}/love_problem.jpg`,
    category: 'service',
    order: 2
  },
  {
    slug: 'marriage-problem-solutions',
    title: { en: 'Marriage Problem Solutions', hi: 'मैरिज प्रॉब्लम सॉल्यूशन', gu: 'મેરેજ પ્રોબ્લેમ સોલ્યુશન' },
    shortDescription: {
      en: 'Remedies for delayed marriage, manglik dosha and compatibility issues for a happy married life.',
      hi: 'विवाह में देरी, मांगलिक दोष और संगतता समस्याओं के लिए उपाय, खुशहाल वैवाहिक जीवन हेतु।',
      gu: 'લગ્નમાં વિલંબ, માંગલિક દોષ અને સુસંગતતા સમસ્યાઓ માટેના ઉપાયો, સુખી વૈવાહિક જીવન માટે.'
    },
    description: {
      en: '<p>Marriage is one of life\'s most significant decisions, and delays or recurring problems can cause a great deal of stress for individuals and their families. Common causes for marriage delays include manglik dosha, unfavorable planetary positions, kundali mismatches, or other astrological obstacles in the birth chart.</p><p>Through detailed horoscope analysis, we identify the root cause of the delay or disturbance and recommend specific remedies - including pujas, mantras and gemstone suggestions - to balance planetary influences and pave the way for a timely, compatible and harmonious marriage.</p><p>For those already married and facing recurring conflicts, our remedies are designed to restore peace, understanding and stability within the relationship.</p>',
      hi: '<p>विवाह जीवन के सबसे महत्वपूर्ण फैसलों में से एक है, और इसमें देरी या बार-बार होने वाली समस्याएं व्यक्ति और परिवार दोनों के लिए तनाव का कारण बन सकती हैं। विवाह में देरी के सामान्य कारणों में मांगलिक दोष, प्रतिकूल ग्रह स्थिति, कुंडली मेल न होना या जन्म कुंडली में अन्य ज्योतिषीय बाधाएं शामिल हैं।</p><p>विस्तृत कुंडली विश्लेषण के माध्यम से, हम देरी या समस्या के मूल कारण की पहचान करते हैं और ग्रहों के प्रभाव को संतुलित करने तथा समय पर, संगत और सामंजस्यपूर्ण विवाह का मार्ग प्रशस्त करने के लिए विशिष्ट उपाय - जिनमें पूजा, मंत्र और रत्न सुझाव शामिल हैं - की सलाह देते हैं।</p><p>जो लोग विवाहित हैं और बार-बार विवादों का सामना कर रहे हैं, उनके लिए हमारे उपाय रिश्ते में शांति, समझ और स्थिरता बहाल करने के लिए डिज़ाइन किए गए हैं।</p>',
      gu: '<p>લગ્ન જીવનના સૌથી મહત્વપૂર્ણ નિર્ણયોમાંનો એક છે, અને તેમાં વિલંબ અથવા વારંવાર થતી સમસ્યાઓ વ્યક્તિ અને પરિવાર બંને માટે તણાવનું કારણ બની શકે છે. લગ્નમાં વિલંબના સામાન્ય કારણોમાં માંગલિક દોષ, પ્રતિકૂળ ગ્રહ સ્થિતિ, કુંડળી મેળ ન ખાવી અથવા જન્મ કુંડળીમાં અન્ય જ્યોતિષીય અવરોધો સામેલ છે.</p><p>વિગતવાર કુંડળી વિશ્લેષણ દ્વારા, અમે વિલંબ અથવા સમસ્યાના મૂળ કારણને ઓળખીએ છીએ અને ગ્રહોના પ્રભાવને સંતુલિત કરવા તથા સમયસર, સુસંગત અને સંવાદિતાપૂર્ણ લગ્નનો માર્ગ મોકળો કરવા માટે ચોક્કસ ઉપાયો - જેમાં પૂજા, મંત્રો અને રત્ન સૂચનો સામેલ છે - સૂચવીએ છીએ.</p><p>જે લોકો પરિણીત છે અને વારંવાર વિવાદોનો સામનો કરી રહ્યા છે, તેમના માટે અમારા ઉપાયો સંબંધમાં શાંતિ, સમજણ અને સ્થિરતા પુનઃસ્થાપિત કરવા માટે બનાવવામાં આવ્યા છે.</p>'
    },
    image: `${BASE_IMG}/marriage_problem.jpg`,
    category: 'service',
    order: 3
  },
  {
    slug: 'husband-wife-problem-solutions',
    title: { en: 'Husband & Wife Problem Solutions', hi: 'पति-पत्नी समस्या समाधान', gu: 'પતિ-પત્ની સમસ્યા ઉકેલ' },
    shortDescription: {
      en: 'Resolve frequent conflicts and restore harmony between husband and wife.',
      hi: 'पति-पत्नी के बीच बार-बार होने वाले झगड़ों को सुलझाएं और सामंजस्य बहाल करें।',
      gu: 'પતિ-પત્ની વચ્ચે વારંવાર થતા ઝઘડાનો ઉકેલ અને સંવાદિતા પુનઃસ્થાપિત કરો.'
    },
    description: {
      en: '<p>Frequent arguments, misunderstandings and growing distance between husband and wife can affect the entire household, including children and extended family. Such issues are often linked to planetary influences in each partner\'s horoscope that create friction, ego clashes, or communication breakdowns.</p><p>By analyzing both partners\' birth charts together, we can identify specific astrological causes behind recurring conflicts and recommend personalized remedies - including pujas, mantras, and lifestyle adjustments - to restore mutual understanding, respect and love in the relationship.</p><p>Our approach focuses on long-term harmony rather than quick fixes, helping couples build a stronger foundation for the years ahead.</p>',
      hi: '<p>पति-पत्नी के बीच बार-बार होने वाले झगड़े, गलतफहमियां और बढ़ती दूरी पूरे परिवार को प्रभावित कर सकती है, जिसमें बच्चे और अन्य परिजन भी शामिल हैं। ऐसे मुद्दे अक्सर दोनों साथियों की कुंडली में ग्रहों के प्रभाव से जुड़े होते हैं जो तनाव, अहंकार टकराव या संवाद की कमी पैदा करते हैं।</p><p>दोनों साथियों की जन्म कुंडली का एक साथ विश्लेषण करके, हम बार-बार होने वाले विवादों के पीछे विशिष्ट ज्योतिषीय कारणों की पहचान करते हैं और रिश्ते में आपसी समझ, सम्मान और प्यार बहाल करने के लिए व्यक्तिगत उपाय - पूजा, मंत्र और जीवनशैली समायोजन सहित - सुझाते हैं।</p><p>हमारा दृष्टिकोण त्वरित समाधान के बजाय लंबे समय तक सामंजस्य पर केंद्रित है, जो जोड़ों को आने वाले वर्षों के लिए एक मजबूत आधार बनाने में मदद करता है।</p>',
      gu: '<p>પતિ-પત્ની વચ્ચે વારંવાર થતા ઝઘડા, ગેરસમજ અને વધતું અંતર સમગ્ર પરિવારને અસર કરી શકે છે, જેમાં બાળકો અને અન્ય સંબંધીઓ પણ સામેલ છે. આવા મુદ્દાઓ ઘણીવાર બંને સાથીઓની કુંડળીમાં ગ્રહોના પ્રભાવ સાથે જોડાયેલા હોય છે જે તણાવ, અહંકાર સંઘર્ષ અથવા સંવાદની ઉણપ ઊભી કરે છે.</p><p>બંને સાથીઓની જન્મ કુંડળીનું એકસાથે વિશ્લેષણ કરીને, અમે વારંવાર થતા વિવાદો પાછળના ચોક્કસ જ્યોતિષીય કારણોને ઓળખીએ છીએ અને સંબંધમાં પરસ્પર સમજણ, સન્માન અને પ્રેમ પુનઃસ્થાપિત કરવા માટે વ્યક્તિગત ઉપાયો - પૂજા, મંત્રો અને જીવનશૈલી ગોઠવણો સહિત - સૂચવીએ છીએ.</p><p>અમારો અભિગમ ઝડપી ઉકેલોને બદલે લાંબા ગાળાની સંવાદિતા પર કેન્દ્રિત છે, જે જોડાંઓને આવનારા વર્ષો માટે મજબૂત પાયો બનાવવામાં મદદ કરે છે.</p>'
    },
    image: `${BASE_IMG}/husband_wife_problem.jpg`,
    category: 'service',
    order: 4
  },
  {
    slug: 'black-magic-removal',
    title: { en: 'Black Magic Removal', hi: 'काला जादू निवारण', gu: 'કાળા જાદુ નિવારણ' },
    shortDescription: {
      en: 'Protection from and removal of black magic and negative energy effects.',
      hi: 'काले जादू और नकारात्मक ऊर्जा के प्रभावों से सुरक्षा और निवारण।',
      gu: 'કાળા જાદુ અને નકારાત્મક ઊર્જાની અસરોથી સુરક્ષા અને નિવારણ.'
    },
    description: {
      en: '<p>Unexplained health issues, sudden financial losses, repeated family disputes, or a persistent feeling of bad luck despite your best efforts can sometimes be the result of black magic or negative energy directed at you or your home.</p><p>Our remedies are designed to identify the presence of such negative influences and remove them through traditional protective rituals, mantras and pujas. These practices not only remove existing negative effects but also create a protective shield against future attempts to harm you spiritually.</p><p>Each case is handled with complete confidentiality and care, as we understand how distressing these experiences can be for individuals and families. Our goal is to restore peace, positivity and stability to your life and home.</p>',
      hi: '<p>अस्पष्ट स्वास्थ्य समस्याएं, अचानक आर्थिक नुकसान, बार-बार परिवारिक विवाद, या आपके सर्वोत्तम प्रयासों के बावजूद लगातार दुर्भाग्य की भावना कभी-कभी आप या आपके घर पर निर्देशित काले जादू या नकारात्मक ऊर्जा का परिणाम हो सकती है।</p><p>हमारे उपाय ऐसे नकारात्मक प्रभावों की पहचान करने और पारंपरिक सुरक्षात्मक रीति-रिवाजों, मंत्रों और पूजा के माध्यम से उन्हें दूर करने के लिए डिज़ाइन किए गए हैं। ये अभ्यास न केवल मौजूदा नकारात्मक प्रभावों को दूर करते हैं बल्कि भविष्य में आध्यात्मिक रूप से नुकसान पहुंचाने के प्रयासों के खिलाफ एक सुरक्षात्मक कवच भी बनाते हैं।</p><p>हर मामले को पूरी गोपनीयता और देखभाल के साथ संभाला जाता है, क्योंकि हम समझते हैं कि ये अनुभव व्यक्तियों और परिवारों के लिए कितने परेशान करने वाले हो सकते हैं।</p>',
      gu: '<p>અસ્પષ્ટ સ્વાસ્થ્ય સમસ્યાઓ, અચાનક આર્થિક નુકસાન, વારંવાર પારિવારિક વિવાદો, અથવા તમારા શ્રેષ્ઠ પ્રયત્નો છતાં સતત દુર્ભાગ્યની લાગણી ક્યારેક તમારા અથવા તમારા ઘર પર નિર્દેશિત કાળા જાદુ અથવા નકારાત્મક ઊર્જાનું પરિણામ હોઈ શકે છે.</p><p>અમારા ઉપાયો આવા નકારાત્મક પ્રભાવોને ઓળખવા અને પરંપરાગત સુરક્ષાત્મક વિધિઓ, મંત્રો અને પૂજા દ્વારા તેને દૂર કરવા માટે બનાવવામાં આવ્યા છે. આ પ્રથાઓ માત્ર હાલના નકારાત્મક પ્રભાવોને દૂર નથી કરતી પરંતુ ભવિષ્યમાં આધ્યાત્મિક રીતે નુકસાન પહોંચાડવાના પ્રયત્નો સામે રક્ષણાત્મક કવચ પણ બનાવે છે.</p><p>દરેક કેસને સંપૂર્ણ ગોપનીયતા અને કાળજી સાથે સંભાળવામાં આવે છે, કારણ કે અમે સમજીએ છીએ કે આ અનુભવો વ્યક્તિઓ અને પરિવારો માટે કેટલા તકલીફદાયક હોઈ શકે છે.</p>'
    },
    image: `${BASE_IMG}/black_magic.png`,
    category: 'service',
    order: 5
  },
  {
    slug: 'vashikaran-expert',
    title: { en: 'Vashikaran Expert', hi: 'वशीकरण विशेषज्ञ', gu: 'વશીકરણ નિષ્ણાત' },
    shortDescription: {
      en: 'Ethical vashikaran remedies for love, family harmony and business success.',
      hi: 'प्रेम, परिवारिक सामंजस्य और व्यापारिक सफलता के लिए नैतिक वशीकरण उपाय।',
      gu: 'પ્રેમ, પારિવારિક સંવાદિતા અને વ્યવસાયિક સફળતા માટે નૈતિક વશીકરણ ઉપાયો.'
    },
    description: {
      en: '<p>Vashikaran is an ancient Vedic practice used to positively influence the thoughts and behavior of another person - whether to win back a loved one\'s affection, gain a family member\'s approval, improve relationships with colleagues, or attract success in business.</p><p>Performed correctly and ethically, vashikaran works by channeling positive energy through specific mantras and rituals that align planetary influences in your favor. It is not about controlling someone against their will, but about removing obstacles, misunderstandings and negative influences that prevent natural harmony in a relationship.</p><p>Our vashikaran remedies are tailored to your specific situation after a detailed consultation, ensuring they are performed safely, responsibly and with positive intent for everyone involved.</p>',
      hi: '<p>वशीकरण एक प्राचीन वैदिक प्रथा है जिसका उपयोग किसी अन्य व्यक्ति के विचारों और व्यवहार को सकारात्मक रूप से प्रभावित करने के लिए किया जाता है - चाहे प्रिय व्यक्ति का प्यार वापस पाना हो, परिवार के सदस्य की सहमति प्राप्त करना हो, सहकर्मियों के साथ संबंध सुधारना हो, या व्यापार में सफलता आकर्षित करना हो।</p><p>सही और नैतिक रूप से किए जाने पर, वशीकरण विशिष्ट मंत्रों और रीति-रिवाजों के माध्यम से सकारात्मक ऊर्जा का संचार करके काम करता है जो ग्रहों के प्रभाव को आपके पक्ष में संरेखित करते हैं। यह किसी को उनकी इच्छा के विरुद्ध नियंत्रित करने के बारे में नहीं है, बल्कि बाधाओं, गलतफहमियों और नकारात्मक प्रभावों को दूर करने के बारे में है।</p><p>हमारे वशीकरण उपाय विस्तृत सलाह के बाद आपकी विशिष्ट स्थिति के अनुसार तैयार किए जाते हैं, यह सुनिश्चित करते हुए कि वे सुरक्षित, जिम्मेदारी से और सभी के लिए सकारात्मक इरादे के साथ किए जाएं।</p>',
      gu: '<p>વશીકરણ એક પ્રાચીન વૈદિક પ્રથા છે જેનો ઉપયોગ બીજી વ્યક્તિના વિચારો અને વર્તનને હકારાત્મક રીતે પ્રભાવિત કરવા માટે થાય છે - ભલે તે પ્રિય વ્યક્તિનો પ્રેમ પાછો મેળવવાનો હોય, પરિવારના સભ્યની સંમતિ મેળવવાનો હોય, સહકાર્યકરો સાથેના સંબંધો સુધારવાનો હોય, અથવા વ્યવસાયમાં સફળતા આકર્ષવાનો હોય.</p><p>યોગ્ય અને નૈતિક રીતે કરવામાં આવે ત્યારે, વશીકરણ ચોક્કસ મંત્રો અને વિધિઓ દ્વારા હકારાત્મક ઊર્જાનું વહન કરીને કાર્ય કરે છે જે ગ્રહોના પ્રભાવને તમારી તરફેણમાં ગોઠવે છે. તે કોઈને તેમની ઇચ્છા વિરુદ્ધ નિયંત્રિત કરવા વિશે નથી, પરંતુ અવરોધો, ગેરસમજ અને નકારાત્મક પ્રભાવોને દૂર કરવા વિશે છે.</p><p>અમારા વશીકરણ ઉપાયો વિગતવાર સલાહ પછી તમારી ચોક્કસ સ્થિતિ અનુસાર તૈયાર કરવામાં આવે છે, એ સુનિશ્ચિત કરીને કે તે સુરક્ષિત, જવાબદારીપૂર્વક અને બધા માટે હકારાત્મક ઇરાદા સાથે કરવામાં આવે.</p>'
    },
    image: `${BASE_IMG}/vashikaran.jpg`,
    category: 'service',
    order: 6
  },
  {
    slug: 'spiritual-healing',
    title: { en: 'Spiritual Healing', hi: 'आध्यात्मिक उपचार', gu: 'આધ્યાત્મિક ઉપચાર' },
    shortDescription: {
      en: 'Restore inner peace and balance through traditional spiritual healing practices.',
      hi: 'पारंपरिक आध्यात्मिक उपचार पद्धतियों से मानसिक शांति और संतुलन बहाल करें।',
      gu: 'પરંપરાગત આધ્યાત્મિક ઉપચાર પ્રથાઓ દ્વારા આંતરિક શાંતિ અને સંતુલન પુનઃસ્થાપિત કરો.'
    },
    description: {
      en: '<p>In today\'s fast-paced life, many people experience stress, anxiety, restlessness or a general feeling of being spiritually unbalanced - even when everything seems fine on the surface. Spiritual healing addresses these deeper, often invisible imbalances through traditional Vedic methods.</p><p>Our spiritual healing services combine prayer, meditation guidance, mantra chanting and energy-cleansing rituals to help release blocked energy, calm the mind, and reconnect you with a sense of purpose and peace. These practices are especially helpful for those going through difficult life transitions, grief, or prolonged stress.</p><p>Whether your struggles are emotional, mental or related to a feeling of negative energy around you, spiritual healing can be a gentle yet powerful step towards renewed wellbeing.</p>',
      hi: '<p>आज की तेज़ रफ्तार जीवनशैली में, कई लोग तनाव, चिंता, बेचैनी या आध्यात्मिक रूप से असंतुलित होने की सामान्य भावना का अनुभव करते हैं - भले ही सतह पर सब कुछ ठीक लगे। आध्यात्मिक उपचार पारंपरिक वैदिक तरीकों से इन गहरे, अक्सर अदृश्य असंतुलनों को संबोधित करता है।</p><p>हमारी आध्यात्मिक उपचार सेवाएं प्रार्थना, ध्यान मार्गदर्शन, मंत्र जाप और ऊर्जा-शुद्धि रीति-रिवाजों को जोड़ती हैं ताकि अवरुद्ध ऊर्जा को मुक्त करने, मन को शांत करने और आपको उद्देश्य व शांति की भावना से जोड़ने में मदद मिल सके।</p><p>चाहे आपकी परेशानियां भावनात्मक, मानसिक हों या आपके आसपास नकारात्मक ऊर्जा की भावना से संबंधित हों, आध्यात्मिक उपचार नई भलाई की दिशा में एक कोमल लेकिन शक्तिशाली कदम हो सकता है।</p>',
      gu: '<p>આજની ઝડપી જીવનશૈલીમાં, ઘણા લોકો તણાવ, ચિંતા, અસ્વસ્થતા અથવા આધ્યાત્મિક રીતે અસંતુલિત હોવાની સામાન્ય લાગણી અનુભવે છે - ભલે સપાટી પર બધું બરાબર લાગે. આધ્યાત્મિક ઉપચાર પરંપરાગત વૈદિક પદ્ધતિઓ દ્વારા આ ગહન, ઘણીવાર અદૃશ્ય અસંતુલનોને સંબોધે છે.</p><p>અમારી આધ્યાત્મિક ઉપચાર સેવાઓ પ્રાર્થના, ધ્યાન માર્ગદર્શન, મંત્ર જાપ અને ઊર્જા-શુદ્ધિ વિધિઓને જોડે છે જેથી અવરોધિત ઊર્જા મુક્ત કરવામાં, મનને શાંત કરવામાં અને તમને હેતુ અને શાંતિની ભાવના સાથે ફરી જોડવામાં મદદ મળે.</p><p>ભલે તમારી મુશ્કેલીઓ ભાવનાત્મક, માનસિક હોય અથવા તમારી આસપાસ નકારાત્મક ઊર્જાની લાગણી સાથે સંબંધિત હોય, આધ્યાત્મિક ઉપચાર નવી સુખાકારી તરફ એક નમ્ર પરંતુ શક્તિશાળી પગલું બની શકે છે.</p>'
    },
    image: `${BASE_IMG}/spiritual_healing.jpg`,
    category: 'service',
    order: 7
  },
  {
    slug: 'enemy-problem-solution',
    title: { en: 'Enemy Problem Solution', hi: 'शत्रु समस्या समाधान', gu: 'દુશ્મન સમસ્યા ઉકેલ' },
    shortDescription: {
      en: 'Astrological protection and remedies to overcome enemies and hidden rivals.',
      hi: 'शत्रुओं और छिपे हुए विरोधियों से निपटने के लिए ज्योतिषीय सुरक्षा और उपाय।',
      gu: 'દુશ્મનો અને છુપાયેલા હરીફોનો સામનો કરવા માટે જ્યોતિષીય સુરક્ષા અને ઉપાયો.'
    },
    description: {
      en: '<p>Whether at the workplace, in business, or within family and social circles, dealing with rivals or enemies who work against your interests can be exhausting and stressful. Astrology offers practical remedies to protect yourself from such negative influences and turn the situation in your favor.</p><p>Through detailed analysis of your horoscope, we identify planetary placements that may be making you vulnerable to opposition or conflict, and recommend specific protective mantras, pujas and remedies to strengthen your position and reduce the impact of enemies.</p><p>These remedies aim not to cause harm to anyone, but to shield you from negative intentions directed at you and help you navigate difficult situations with greater confidence and stability.</p>',
      hi: '<p>कार्यस्थल पर, व्यापार में, या परिवार और सामाजिक दायरे में, उन प्रतिद्वंद्वियों या शत्रुओं से निपटना जो आपके हितों के विरुद्ध कार्य करते हैं, थकाने वाला और तनावपूर्ण हो सकता है। ज्योतिष ऐसे नकारात्मक प्रभावों से अपनी रक्षा करने और स्थिति को अपने पक्ष में करने के लिए व्यावहारिक उपाय प्रदान करता है।</p><p>आपकी कुंडली के विस्तृत विश्लेषण के माध्यम से, हम ग्रहों की स्थितियों की पहचान करते हैं जो आपको विरोध या संघर्ष के प्रति संवेदनशील बना सकती हैं, और आपकी स्थिति को मजबूत करने के लिए विशिष्ट सुरक्षात्मक मंत्र, पूजा और उपाय सुझाते हैं।</p><p>इन उपायों का उद्देश्य किसी को नुकसान पहुंचाना नहीं है, बल्कि आपको आपके विरुद्ध निर्देशित नकारात्मक इरादों से बचाना और कठिन परिस्थितियों का अधिक आत्मविश्वास के साथ सामना करने में मदद करना है।</p>',
      gu: '<p>કાર્યસ્થળે, વ્યવસાયમાં, અથવા પરિવાર અને સામાજિક વર્તુળોમાં, તમારા હિતો વિરુદ્ધ કાર્ય કરતા હરીફો અથવા દુશ્મનો સાથે વ્યવહાર કરવો કંટાળાજનક અને તણાવપૂર્ણ હોઈ શકે છે. જ્યોતિષ આવા નકારાત્મક પ્રભાવોથી તમારી રક્ષા કરવા અને પરિસ્થિતિને તમારી તરફેણમાં ફેરવવા માટે વ્યવહારુ ઉપાયો પ્રદાન કરે છે.</p><p>તમારી કુંડળીના વિગતવાર વિશ્લેષણ દ્વારા, અમે ગ્રહોની સ્થિતિઓને ઓળખીએ છીએ જે તમને વિરોધ અથવા સંઘર્ષ માટે સંવેદનશીલ બનાવી શકે છે, અને તમારી સ્થિતિ મજબૂત કરવા માટે ચોક્કસ સુરક્ષાત્મક મંત્રો, પૂજા અને ઉપાયો સૂચવીએ છીએ.</p><p>આ ઉપાયોનો હેતુ કોઈને નુકસાન પહોંચાડવાનો નથી, પરંતુ તમને તમારી વિરુદ્ધ નિર્દેશિત નકારાત્મક ઇરાદાઓથી બચાવવાનો અને મુશ્કેલ પરિસ્થિતિઓનો વધુ આત્મવિશ્વાસ સાથે સામનો કરવામાં મદદ કરવાનો છે.</p>'
    },
    image: `${BASE_IMG}/enemy_problem.jpg`,
    category: 'service',
    order: 8
  },
  {
    slug: 'horoscope-reading',
    title: { en: 'Horoscope Reading', hi: 'कुंडली वाचन', gu: 'કુંડળી વાંચન' },
    shortDescription: {
      en: 'Detailed birth chart (kundli) analysis for guidance on career, marriage and life.',
      hi: 'करियर, विवाह और जीवन मार्गदर्शन के लिए विस्तृत जन्म कुंडली विश्लेषण।',
      gu: 'કારકિર્દી, લગ્ન અને જીવન માર્ગદર્શન માટે વિગતવાર જન્મ કુંડળી વિશ્લેષણ.'
    },
    description: {
      en: '<p>Your birth chart, or kundli, is a map of the planetary positions at the exact time of your birth, and it holds valuable insights into your personality, strengths, challenges and the timing of major life events. A detailed horoscope reading can offer clarity on questions about career direction, marriage timing, health, finances and more.</p><p>Our horoscope reading service involves a thorough analysis of your kundli, identifying favorable and challenging planetary periods (dashas), doshas that may need remedies, and the overall strengths in your chart that can be leveraged for growth and success.</p><p>Whether you are seeking guidance for a major life decision or simply want to better understand yourself and your path, an accurate horoscope reading can provide the clarity and direction you need.</p>',
      hi: '<p>आपकी जन्म कुंडली आपके जन्म के सटीक समय पर ग्रहों की स्थिति का एक नक्शा है, और इसमें आपके व्यक्तित्व, शक्तियों, चुनौतियों और जीवन की प्रमुख घटनाओं के समय के बारे में मूल्यवान जानकारी होती है। एक विस्तृत कुंडली वाचन करियर दिशा, विवाह के समय, स्वास्थ्य, वित्त और अधिक के बारे में स्पष्टता प्रदान कर सकता है।</p><p>हमारी कुंडली वाचन सेवा में आपकी कुंडली का गहन विश्लेषण शामिल है, जिसमें अनुकूल और चुनौतीपूर्ण ग्रह अवधि (दशा), दोष जिन्हें उपायों की आवश्यकता हो सकती है, और आपकी कुंडली में समग्र शक्तियों की पहचान की जाती है।</p><p>चाहे आप जीवन के किसी बड़े फैसले के लिए मार्गदर्शन चाहते हों या बस अपने और अपने मार्ग को बेहतर ढंग से समझना चाहते हों, एक सटीक कुंडली वाचन आपको आवश्यक स्पष्टता और दिशा प्रदान कर सकता है।</p>',
      gu: '<p>તમારી જન્મ કુંડળી તમારા જન્મના ચોક્કસ સમયે ગ્રહોની સ્થિતિનો નકશો છે, અને તેમાં તમારી વ્યક્તિત્વ, શક્તિઓ, પડકારો અને જીવનની મહત્વપૂર્ણ ઘટનાઓના સમય વિશે મૂલ્યવાન માહિતી છે. વિગતવાર કુંડળી વાંચન કારકિર્દી દિશા, લગ્નનો સમય, સ્વાસ્થ્ય, નાણાં અને વધુ વિશે સ્પષ્ટતા આપી શકે છે.</p><p>અમારી કુંડળી વાંચન સેવામાં તમારી કુંડળીનું ઊંડાણપૂર્વક વિશ્લેષણ સામેલ છે, જેમાં અનુકૂળ અને પડકારજનક ગ્રહ સમયગાળા (દશા), દોષો જેને ઉપાયોની જરૂર પડી શકે, અને તમારી કુંડળીમાં એકંદર શક્તિઓ ઓળખવામાં આવે છે.</p><p>ભલે તમે જીવનના કોઈ મોટા નિર્ણય માટે માર્ગદર્શન શોધી રહ્યા હોવ અથવા ફક્ત તમારી અને તમારા માર્ગને વધુ સારી રીતે સમજવા માંગતા હોવ, સચોટ કુંડળી વાંચન તમને જરૂરી સ્પષ્ટતા અને દિશા આપી શકે છે.</p>'
    },
    image: `${BASE_IMG}/horoscope_reading.jpg`,
    category: 'service',
    order: 9
  },
  {
    slug: 'santan-prapti',
    title: { en: 'Santan Prapti (Childbirth Solutions)', hi: 'संतान प्राप्ति समाधान', gu: 'સંતાન પ્રાપ્તિ ઉકેલો' },
    shortDescription: {
      en: 'Astrological remedies and pujas for couples facing delays in having children.',
      hi: 'संतान प्राप्ति में देरी का सामना कर रहे जोड़ों के लिए ज्योतिषीय उपाय और पूजा।',
      gu: 'સંતાન પ્રાપ્તિમાં વિલંબનો સામનો કરી રહેલા જોડાં માટે જ્યોતિષીય ઉપાયો અને પૂજા.'
    },
    description: {
      en: '<p>For many couples, the desire to start a family is one of the most heartfelt wishes, and delays in conceiving can bring significant emotional stress. In Vedic astrology, such delays are often linked to specific planetary doshas in the birth charts of one or both partners.</p><p>Our santan prapti remedies involve careful analysis of both partners\' horoscopes to identify any doshas affecting the 5th house (which governs children) and recommend appropriate pujas, mantras and remedial measures to help remove these obstacles.</p><p>These remedies are offered with sensitivity and care, recognizing how personal and emotional this journey can be for couples. Many families have found renewed hope and positive outcomes through these traditional practices combined with patience and faith.</p>',
      hi: '<p>कई जोड़ों के लिए, परिवार शुरू करने की इच्छा सबसे हार्दिक इच्छाओं में से एक है, और गर्भधारण में देरी महत्वपूर्ण भावनात्मक तनाव ला सकती है। वैदिक ज्योतिष में, ऐसी देरी अक्सर एक या दोनों साथियों की जन्म कुंडली में विशिष्ट ग्रह दोषों से जुड़ी होती है।</p><p>हमारे संतान प्राप्ति उपायों में दोनों साथियों की कुंडली का सावधानीपूर्वक विश्लेषण शामिल है ताकि पंचम भाव (जो संतान को नियंत्रित करता है) को प्रभावित करने वाले किसी भी दोष की पहचान की जा सके और इन बाधाओं को दूर करने में मदद के लिए उचित पूजा, मंत्र और उपाय सुझाए जा सकें।</p><p>ये उपाय संवेदनशीलता और देखभाल के साथ प्रदान किए जाते हैं, यह पहचानते हुए कि यह यात्रा जोड़ों के लिए कितनी व्यक्तिगत और भावनात्मक हो सकती है।</p>',
      gu: '<p>ઘણા જોડાં માટે, પરિવાર શરૂ કરવાની ઇચ્છા સૌથી હૃદયસ્પર્શી ઇચ્છાઓમાંની એક છે, અને ગર્ભધારણમાં વિલંબ નોંધપાત્ર ભાવનાત્મક તણાવ લાવી શકે છે. વૈદિક જ્યોતિષમાં, આવા વિલંબ ઘણીવાર એક અથવા બંને સાથીઓની જન્મ કુંડળીમાં ચોક્કસ ગ્રહ દોષો સાથે જોડાયેલા હોય છે.</p><p>અમારા સંતાન પ્રાપ્તિ ઉપાયોમાં બંને સાથીઓની કુંડળીનું કાળજીપૂર્વક વિશ્લેષણ સામેલ છે જેથી પાંચમા ભાવ (જે સંતાનને નિયંત્રિત કરે છે) ને અસર કરતા કોઈપણ દોષને ઓળખી શકાય અને આ અવરોધો દૂર કરવામાં મદદ માટે યોગ્ય પૂજા, મંત્રો અને ઉપાયો સૂચવી શકાય.</p><p>આ ઉપાયો સંવેદનશીલતા અને કાળજી સાથે પ્રદાન કરવામાં આવે છે, એ ઓળખીને કે આ યાત્રા જોડાં માટે કેટલી વ્યક્તિગત અને ભાવનાત્મક હોઈ શકે છે.</p>'
    },
    image: `${BASE_IMG}/santan_prapti.jpg`,
    category: 'service',
    order: 10
  },
  {
    slug: 'business-problem-solution',
    title: { en: 'Business Problem Solution', hi: 'व्यापार समस्या समाधान', gu: 'વ્યવસાય સમસ્યા ઉકેલ' },
    shortDescription: {
      en: 'Remedies for business losses, partnership disputes and stagnant growth.',
      hi: 'व्यापार में नुकसान, साझेदारी विवाद और रुकी हुई वृद्धि के लिए उपाय।',
      gu: 'વ્યવસાયમાં નુકસાન, ભાગીદારી વિવાદો અને અટકેલી વૃદ્ધિ માટેના ઉપાયો.'
    },
    description: {
      en: '<p>Running a business comes with its share of challenges, but persistent losses, partnership conflicts, or growth that seems permanently stuck despite hard work can often have astrological roots in the planetary positions related to wealth, career and partnerships in your horoscope.</p><p>Our business problem remedies begin with a detailed review of your horoscope to identify planetary periods or doshas that may be affecting your business negatively. Based on this analysis, we recommend specific remedies including pujas for prosperity, mantras for removing obstacles, and gemstone or yantra suggestions to attract positive energy and financial growth.</p><p>Whether you are dealing with cash flow issues, disputes with business partners, or simply want to take your business to the next level, astrological guidance can provide a fresh perspective and practical path forward.</p>',
      hi: '<p>व्यापार चलाने में अपनी चुनौतियां होती हैं, लेकिन कड़ी मेहनत के बावजूद लगातार नुकसान, साझेदारी विवाद, या स्थायी रूप से रुकी हुई वृद्धि अक्सर आपकी कुंडली में धन, करियर और साझेदारी से संबंधित ग्रहों की स्थिति में ज्योतिषीय जड़ें हो सकती हैं।</p><p>हमारे व्यापार समस्या उपाय आपकी कुंडली की विस्तृत समीक्षा से शुरू होते हैं ताकि ग्रह अवधि या दोषों की पहचान की जा सके जो आपके व्यापार को नकारात्मक रूप से प्रभावित कर सकते हैं। इस विश्लेषण के आधार पर, हम समृद्धि के लिए पूजा, बाधाओं को दूर करने के लिए मंत्र, और सकारात्मक ऊर्जा व आर्थिक वृद्धि को आकर्षित करने के लिए रत्न या यंत्र सुझाव सहित विशिष्ट उपायों की सलाह देते हैं।</p><p>चाहे आप नकदी प्रवाह की समस्याओं से जूझ रहे हों, व्यापारिक साझेदारों के साथ विवाद हो, या बस अपने व्यापार को आगे ले जाना चाहते हों, ज्योतिषीय मार्गदर्शन एक नया दृष्टिकोण और व्यावहारिक मार्ग प्रदान कर सकता है।</p>',
      gu: '<p>વ્યવસાય ચલાવવામાં તેના પોતાના પડકારો હોય છે, પરંતુ સખત મહેનત છતાં સતત નુકસાન, ભાગીદારી વિવાદો, અથવા સ્થાયી રીતે અટકેલી વૃદ્ધિ ઘણીવાર તમારી કુંડળીમાં ધન, કારકિર્દી અને ભાગીદારી સંબંધિત ગ્રહોની સ્થિતિમાં જ્યોતિષીય મૂળ ધરાવી શકે છે.</p><p>અમારા વ્યવસાય સમસ્યા ઉપાયો તમારી કુંડળીની વિગતવાર સમીક્ષાથી શરૂ થાય છે જેથી ગ્રહ સમયગાળા અથવા દોષોને ઓળખી શકાય જે તમારા વ્યવસાયને નકારાત્મક રીતે અસર કરી શકે છે. આ વિશ્લેષણના આધારે, અમે સમૃદ્ધિ માટે પૂજા, અવરોધો દૂર કરવા માટે મંત્રો, અને હકારાત્મક ઊર્જા તથા આર્થિક વૃદ્ધિ આકર્ષવા માટે રત્ન અથવા યંત્ર સૂચનો સહિત ચોક્કસ ઉપાયો સૂચવીએ છીએ.</p><p>ભલે તમે રોકડ પ્રવાહની સમસ્યાઓ સાથે સંઘર્ષ કરી રહ્યા હોવ, વ્યવસાયિક ભાગીદારો સાથે વિવાદ હોય, અથવા ફક્ત તમારા વ્યવસાયને આગલા સ્તરે લઈ જવા માંગતા હોવ, જ્યોતિષીય માર્ગદર્શન નવો દૃષ્ટિકોણ અને વ્યવહારુ માર્ગ પ્રદાન કરી શકે છે.</p>'
    },
    image: `${BASE_IMG}/business_problem.jpg`,
    category: 'service',
    order: 11
  },
  {
    slug: 'jobs-and-career-expert',
    title: { en: 'Jobs & Career Expert', hi: 'नौकरी और करियर विशेषज्ञ', gu: 'નોકરી અને કારકિર્દી નિષ્ણાત' },
    shortDescription: {
      en: 'Astrological guidance for job stability, promotions and career growth.',
      hi: 'नौकरी की स्थिरता, पदोन्नति और करियर वृद्धि के लिए ज्योतिषीय मार्गदर्शन।',
      gu: 'નોકરીની સ્થિરતા, પ્રમોશન અને કારકિર્દી વૃદ્ધિ માટે જ્યોતિષીય માર્ગદર્શન.'
    },
    description: {
      en: '<p>Career-related stress is one of the most common concerns people bring to an astrologer - whether it is difficulty finding the right job, repeated setbacks at work, delays in promotion, or uncertainty about which career path to pursue.</p><p>Through analysis of the 10th house (career) and related planetary periods in your horoscope, we can identify the underlying astrological factors affecting your professional life and suggest remedies to improve job stability, attract new opportunities, and support promotions or career changes at the right time.</p><p>Our guidance combines traditional astrological remedies - such as mantras and gemstone recommendations - with practical insights about favorable timing for important career decisions, interviews, or business launches.</p>',
      hi: '<p>करियर संबंधी तनाव उन सबसे सामान्य चिंताओं में से एक है जो लोग ज्योतिषी के पास लाते हैं - चाहे वह सही नौकरी ढूंढने में कठिनाई हो, काम में बार-बार असफलता हो, पदोन्नति में देरी हो, या किस करियर पथ को अपनाना है इस बारे में अनिश्चितता हो।</p><p>आपकी कुंडली में दशम भाव (करियर) और संबंधित ग्रह अवधियों के विश्लेषण के माध्यम से, हम आपके पेशेवर जीवन को प्रभावित करने वाले अंतर्निहित ज्योतिषीय कारकों की पहचान कर सकते हैं और नौकरी की स्थिरता में सुधार, नए अवसरों को आकर्षित करने, और सही समय पर पदोन्नति या करियर परिवर्तन का समर्थन करने के उपाय सुझा सकते हैं।</p><p>हमारा मार्गदर्शन पारंपरिक ज्योतिषीय उपायों - जैसे मंत्र और रत्न सिफारिशें - को महत्वपूर्ण करियर निर्णयों के लिए अनुकूल समय के बारे में व्यावहारिक जानकारी के साथ जोड़ता है।</p>',
      gu: '<p>કારકિર્દી સંબંધિત તણાવ એ સૌથી સામાન્ય ચિંતાઓમાંની એક છે જે લોકો જ્યોતિષી પાસે લાવે છે - ભલે તે યોગ્ય નોકરી શોધવામાં મુશ્કેલી હોય, કામમાં વારંવાર નિષ્ફળતા હોય, પ્રમોશનમાં વિલંબ હોય, અથવા કયો કારકિર્દી માર્ગ અપનાવવો તે વિશે અનિશ્ચિતતા હોય.</p><p>તમારી કુંડળીમાં દશમ ભાવ (કારકિર્દી) અને સંબંધિત ગ્રહ સમયગાળાના વિશ્લેષણ દ્વારા, અમે તમારા વ્યવસાયિક જીવનને અસર કરતા અંતર્ગત જ્યોતિષીય પરિબળોને ઓળખી શકીએ છીએ અને નોકરીની સ્થિરતા સુધારવા, નવી તકો આકર્ષવા, અને યોગ્ય સમયે પ્રમોશન અથવા કારકિર્દી પરિવર્તનને ટેકો આપવાના ઉપાયો સૂચવી શકીએ છીએ.</p><p>અમારું માર્ગદર્શન પરંપરાગત જ્યોતિષીય ઉપાયો - જેમ કે મંત્રો અને રત્ન સૂચનો - ને મહત્વપૂર્ણ કારકિર્દી નિર્ણયો માટે અનુકૂળ સમય વિશે વ્યવહારુ માહિતી સાથે જોડે છે.</p>'
    },
    image: `${BASE_IMG}/job_career.jpg`,
    category: 'service',
    order: 12
  },
  {
    slug: 'hast-rekha-reading',
    title: { en: 'Hast Rekha (Palm) Reading', hi: 'हस्त रेखा वाचन', gu: 'હસ્ત રેખા વાંચન' },
    shortDescription: {
      en: 'Detailed palmistry reading revealing insights about your past, present and future.',
      hi: 'आपके भूत, वर्तमान और भविष्य के बारे में जानकारी देने वाला विस्तृत हस्त रेखा वाचन।',
      gu: 'તમારા ભૂત, વર્તમાન અને ભવિષ્ય વિશે માહિતી આપતું વિગતવાર હસ્ત રેખા વાંચન.'
    },
    description: {
      en: '<p>Hast Rekha Shastra, or palmistry, is one of the oldest branches of Vedic knowledge used to understand a person\'s character, life path, and the timing of significant events by studying the lines, mounts and shapes of the hands.</p><p>A detailed palm reading session can provide insights into your career trajectory, marriage prospects, health tendencies, financial patterns, and emotional nature. It is also a valuable tool for understanding personal strengths and areas that may benefit from extra attention or remedial measures.</p><p>Our palm reading sessions are conducted with careful attention to detail, examining both hands to give you a comprehensive picture of your life patterns - past influences, present circumstances, and the possibilities that lie ahead.</p>',
      hi: '<p>हस्त रेखा शास्त्र, या पामिस्ट्री, वैदिक ज्ञान की सबसे पुरानी शाखाओं में से एक है जिसका उपयोग हाथों की रेखाओं, उभारों और आकृतियों का अध्ययन करके किसी व्यक्ति के चरित्र, जीवन पथ और महत्वपूर्ण घटनाओं के समय को समझने के लिए किया जाता है।</p><p>एक विस्तृत हस्त रेखा वाचन सत्र आपके करियर की दिशा, विवाह की संभावनाओं, स्वास्थ्य प्रवृत्तियों, आर्थिक पैटर्न और भावनात्मक स्वभाव के बारे में जानकारी प्रदान कर सकता है। यह व्यक्तिगत शक्तियों और उन क्षेत्रों को समझने के लिए भी एक मूल्यवान उपकरण है जिन्हें अतिरिक्त ध्यान या उपायों से लाभ हो सकता है।</p><p>हमारे हस्त रेखा वाचन सत्र विस्तार पर सावधानीपूर्वक ध्यान देकर आयोजित किए जाते हैं, दोनों हाथों की जांच करके आपको आपके जीवन पैटर्न की व्यापक तस्वीर प्रदान की जाती है।</p>',
      gu: '<p>હસ્ત રેખા શાસ્ત્ર, અથવા પામિસ્ટ્રી, વૈદિક જ્ઞાનની સૌથી જૂની શાખાઓમાંની એક છે જેનો ઉપયોગ હાથની રેખાઓ, ઉભારો અને આકારોનો અભ્યાસ કરીને વ્યક્તિના ચરિત્ર, જીવન માર્ગ અને મહત્વપૂર્ણ ઘટનાઓના સમયને સમજવા માટે થાય છે.</p><p>વિગતવાર હસ્ત રેખા વાંચન સત્ર તમારી કારકિર્દીની દિશા, લગ્નની શક્યતાઓ, સ્વાસ્થ્ય વલણો, આર્થિક પેટર્ન અને ભાવનાત્મક સ્વભાવ વિશે માહિતી આપી શકે છે. તે વ્યક્તિગત શક્તિઓ અને એ ક્ષેત્રોને સમજવા માટે પણ મૂલ્યવાન સાધન છે જેને વધારાના ધ્યાન અથવા ઉપાયોથી ફાયદો થઈ શકે.</p><p>અમારા હસ્ત રેખા વાંચન સત્રો વિગત પર કાળજીપૂર્વક ધ્યાન આપીને હાથ ધરવામાં આવે છે, બંને હાથની તપાસ કરીને તમને તમારા જીવન પેટર્નનું વ્યાપક ચિત્ર આપવામાં આવે છે.</p>'
    },
    image: `${BASE_IMG}/hast_r.jpg`,
    category: 'service',
    order: 13
  },
  {
    slug: 'gem-stone-services',
    title: { en: 'Gem Stone Services', hi: 'रत्न सेवाएं', gu: 'રત્ન સેવાઓ' },
    shortDescription: {
      en: 'Genuine, certified astrological gemstones recommended after horoscope analysis.',
      hi: 'कुंडली विश्लेषण के बाद सुझाए गए असली, प्रमाणित ज्योतिषीय रत्न।',
      gu: 'કુંડળી વિશ્લેષણ પછી સૂચવેલ અસલ, પ્રમાણિત જ્યોતિષીય રત્નો.'
    },
    description: {
      en: '<p>Gemstones have been used in Vedic astrology for centuries to strengthen weak planets, balance planetary influences, and amplify positive energies in a person\'s life. However, wearing the wrong gemstone - or one that hasn\'t been properly recommended - can sometimes do more harm than good.</p><p>Our gemstone service begins with a thorough analysis of your birth chart to determine which planets need strengthening and which gemstones would be most beneficial for your specific situation, whether it relates to career, health, relationships, or finances.</p><p>We provide genuine, certified gemstones along with guidance on the correct way to wear them - including the appropriate metal, finger, day and time for wearing - to ensure you receive their full astrological benefit.</p>',
      hi: '<p>रत्नों का उपयोग वैदिक ज्योतिष में सदियों से कमजोर ग्रहों को मजबूत करने, ग्रहों के प्रभाव को संतुलित करने और व्यक्ति के जीवन में सकारात्मक ऊर्जा को बढ़ाने के लिए किया जाता रहा है। हालांकि, गलत रत्न पहनना - या जो ठीक से सुझाया नहीं गया हो - कभी-कभी फायदे से ज्यादा नुकसान कर सकता है।</p><p>हमारी रत्न सेवा आपकी जन्म कुंडली के गहन विश्लेषण से शुरू होती है ताकि यह निर्धारित किया जा सके कि किन ग्रहों को मजबूती की आवश्यकता है और कौन से रत्न आपकी विशिष्ट स्थिति के लिए सबसे फायदेमंद होंगे।</p><p>हम असली, प्रमाणित रत्न प्रदान करते हैं साथ ही उन्हें पहनने के सही तरीके के बारे में मार्गदर्शन - जिसमें उचित धातु, अंगुली, दिन और समय शामिल है - ताकि आपको उनका पूरा ज्योतिषीय लाभ मिल सके।</p>',
      gu: '<p>રત્નોનો ઉપયોગ વૈદિક જ્યોતિષમાં સદીઓથી નબળા ગ્રહોને મજબૂત કરવા, ગ્રહોના પ્રભાવને સંતુલિત કરવા અને વ્યક્તિના જીવનમાં હકારાત્મક ઊર્જા વધારવા માટે થતો રહ્યો છે. જો કે, ખોટું રત્ન પહેરવાથી - અથવા જે યોગ્ય રીતે સૂચવવામાં ન આવ્યું હોય - ક્યારેક ફાયદા કરતાં વધુ નુકસાન થઈ શકે છે.</p><p>અમારી રત્ન સેવા તમારી જન્મ કુંડળીના ઊંડાણપૂર્વક વિશ્લેષણથી શરૂ થાય છે જેથી નક્કી કરી શકાય કે કયા ગ્રહોને મજબૂતીની જરૂર છે અને કયા રત્નો તમારી ચોક્કસ સ્થિતિ માટે સૌથી ફાયદાકારક રહેશે.</p><p>અમે અસલ, પ્રમાણિત રત્નો પ્રદાન કરીએ છીએ સાથે સાથે તેને પહેરવાની યોગ્ય રીત વિશે માર્ગદર્શન - જેમાં યોગ્ય ધાતુ, આંગળી, દિવસ અને સમય સામેલ છે - જેથી તમને તેનો સંપૂર્ણ જ્યોતિષીય લાભ મળે.</p>'
    },
    image: `${BASE_IMG}/gem_stone.jpg`,
    price: 0,
    category: 'product',
    order: 14
  },
  {
    slug: 'health-issues',
    title: { en: 'Health Issues Solution', hi: 'स्वास्थ्य समस्या समाधान', gu: 'સ્વાસ્થ્ય સમસ્યા ઉકેલ' },
    shortDescription: {
      en: 'Astrological remedies to support recovery from prolonged or unexplained health issues.',
      hi: 'लंबे समय से चली आ रही या अस्पष्ट स्वास्थ्य समस्याओं से उबरने के लिए ज्योतिषीय उपाय।',
      gu: 'લાંબા સમયથી ચાલતી અથવા અસ્પષ્ટ સ્વાસ્થ્ય સમસ્યાઓમાંથી રિકવરી માટે જ્યોતિષીય ઉપાયો.'
    },
    description: {
      en: '<p>While medical treatment should always be the first priority for any health concern, Vedic astrology recognizes that certain planetary influences in a person\'s horoscope can correspond with prolonged illnesses, slow recovery, or recurring health issues that don\'t seem to have a clear medical explanation.</p><p>Our health-related astrological remedies are intended as a complementary support alongside medical care - not a replacement for it. By analyzing the houses and planets related to health in your horoscope, we identify any doshas that may be contributing to ongoing health struggles and recommend pujas, mantras or other remedial measures that are traditionally believed to support healing and overall wellbeing.</p><p>Many families have found that combining medical treatment with these traditional remedies brings additional peace of mind during difficult health journeys.</p>',
      hi: '<p>हालांकि किसी भी स्वास्थ्य संबंधी चिंता के लिए चिकित्सा उपचार को हमेशा पहली प्राथमिकता दी जानी चाहिए, वैदिक ज्योतिष यह मानता है कि किसी व्यक्ति की कुंडली में कुछ ग्रहों का प्रभाव लंबी बीमारियों, धीमी रिकवरी, या बार-बार होने वाली स्वास्थ्य समस्याओं से जुड़ा हो सकता है जिनका कोई स्पष्ट चिकित्सीय कारण नहीं दिखता।</p><p>हमारे स्वास्थ्य संबंधी ज्योतिषीय उपाय चिकित्सा देखभाल के साथ एक पूरक सहायता के रूप में हैं - इसका विकल्प नहीं। आपकी कुंडली में स्वास्थ्य से संबंधित भावों और ग्रहों का विश्लेषण करके, हम किसी भी दोष की पहचान करते हैं जो चल रही स्वास्थ्य समस्याओं में योगदान दे सकता है और पूजा, मंत्र या अन्य उपाय सुझाते हैं।</p><p>कई परिवारों ने पाया है कि चिकित्सा उपचार के साथ इन पारंपरिक उपायों को जोड़ने से कठिन स्वास्थ्य यात्राओं के दौरान अतिरिक्त मानसिक शांति मिलती है।</p>',
      gu: '<p>જ્યારે કોઈપણ સ્વાસ્થ્ય સંબંધિત ચિંતા માટે તબીબી સારવારને હંમેશા પ્રથમ પ્રાથમિકતા આપવી જોઈએ, વૈદિક જ્યોતિષ માને છે કે વ્યક્તિની કુંડળીમાં ચોક્કસ ગ્રહોનો પ્રભાવ લાંબી બીમારીઓ, ધીમી રિકવરી, અથવા વારંવાર થતી સ્વાસ્થ્ય સમસ્યાઓ સાથે સંબંધિત હોઈ શકે છે જેનું કોઈ સ્પષ્ટ તબીબી કારણ દેખાતું નથી.</p><p>અમારા સ્વાસ્થ્ય સંબંધિત જ્યોતિષીય ઉપાયો તબીબી સંભાળ સાથે પૂરક સહાય તરીકે છે - તેનો વિકલ્પ નથી. તમારી કુંડળીમાં સ્વાસ્થ્ય સંબંધિત ભાવો અને ગ્રહોનું વિશ્લેષણ કરીને, અમે કોઈપણ દોષને ઓળખીએ છીએ જે ચાલુ સ્વાસ્થ્ય સમસ્યાઓમાં ફાળો આપી શકે અને પૂજા, મંત્રો અથવા અન્ય ઉપાયો સૂચવીએ છીએ.</p><p>ઘણા પરિવારોએ જોયું છે કે તબીબી સારવાર સાથે આ પરંપરાગત ઉપાયોને જોડવાથી મુશ્કેલ સ્વાસ્થ્ય યાત્રાઓ દરમિયાન વધારાની માનસિક શાંતિ મળે છે.</p>'
    },
    image: `${BASE_IMG}/health_issues.jpg`,
    category: 'service',
    order: 15
  },
  {
    slug: 'all-goddess-puja',
    title: { en: 'All Goddess Puja', hi: 'सभी देवी पूजा', gu: 'તમામ દેવી પૂજા' },
    shortDescription: {
      en: 'Sacred pujas for Durga Maa, Kali Maa, Lakshmi Maa, Hanuman and more.',
      hi: 'दुर्गा माँ, काली माँ, लक्ष्मी माँ, हनुमान आदि के लिए पवित्र पूजा।',
      gu: 'દુર્ગા માઁ, કાલી માઁ, લક્ષ્મી માઁ, હનુમાન વગેરે માટે પવિત્ર પૂજા.'
    },
    description: {
      en: '<p>Pujas have been an integral part of Vedic tradition for bringing divine blessings, removing obstacles, and inviting prosperity, health and harmony into a household. Our astrologer is experienced in performing a wide range of pujas dedicated to various deities, each suited to different needs and intentions.</p><p>We offer pujas for Durga Maa (for protection and strength), Kali Maa (for removing negative energies), Lakshmi Maa (for wealth and prosperity), Hanuman (for courage and overcoming obstacles), Krishna (for harmony and devotion), and many more, performed with complete purity, devotion and adherence to traditional rituals.</p><p>Whether you wish to conduct a puja at your home for a special occasion, to mark an important life event, or simply to invite positive energy into your life and family, we can guide you through the process and perform the rituals with sincerity and care.</p>',
      hi: '<p>पूजा वैदिक परंपरा का एक अभिन्न हिस्सा रही है जो परिवार में दिव्य आशीर्वाद लाने, बाधाओं को दूर करने और समृद्धि, स्वास्थ्य व सामंजस्य को आमंत्रित करने के लिए की जाती है। हमारे ज्योतिषी विभिन्न देवताओं को समर्पित कई प्रकार की पूजाओं को करने में अनुभवी हैं।</p><p>हम दुर्गा माँ (सुरक्षा और शक्ति के लिए), काली माँ (नकारात्मक ऊर्जा को दूर करने के लिए), लक्ष्मी माँ (धन और समृद्धि के लिए), हनुमान (साहस और बाधाओं पर काबू पाने के लिए), कृष्ण (सामंजस्य और भक्ति के लिए) और कई अन्य पूजा प्रदान करते हैं, जो पूर्ण पवित्रता, भक्ति और पारंपरिक रीति-रिवाजों के पालन के साथ की जाती हैं।</p><p>चाहे आप किसी विशेष अवसर के लिए घर पर पूजा करवाना चाहते हों, किसी महत्वपूर्ण जीवन घटना को चिह्नित करना चाहते हों, या बस अपने जीवन और परिवार में सकारात्मक ऊर्जा आमंत्रित करना चाहते हों, हम इस प्रक्रिया में आपका मार्गदर्शन कर सकते हैं।</p>',
      gu: '<p>પૂજા વૈદિક પરંપરાનો અભિન્ન ભાગ રહી છે જે પરિવારમાં દિવ્ય આશીર્વાદ લાવવા, અવરોધો દૂર કરવા અને સમૃદ્ધિ, સ્વાસ્થ્ય અને સંવાદિતાને આમંત્રિત કરવા માટે કરવામાં આવે છે. અમારા જ્યોતિષી વિવિધ દેવતાઓને સમર્પિત ઘણા પ્રકારની પૂજા કરવામાં અનુભવી છે.</p><p>અમે દુર્ગા માઁ (સુરક્ષા અને શક્તિ માટે), કાલી માઁ (નકારાત્મક ઊર્જા દૂર કરવા માટે), લક્ષ્મી માઁ (ધન અને સમૃદ્ધિ માટે), હનુમાન (હિંમત અને અવરોધો પર કાબુ મેળવવા માટે), કૃષ્ણ (સંવાદિતા અને ભક્તિ માટે) અને ઘણી વધુ પૂજા પ્રદાન કરીએ છીએ, જે સંપૂર્ણ પવિત્રતા, ભક્તિ અને પરંપરાગત વિધિઓના પાલન સાથે કરવામાં આવે છે.</p><p>ભલે તમે કોઈ ખાસ પ્રસંગ માટે ઘરે પૂજા કરાવવા માંગતા હોવ, કોઈ મહત્વપૂર્ણ જીવન ઘટનાને ચિહ્નિત કરવા માંગતા હોવ, અથવા ફક્ત તમારા જીવન અને પરિવારમાં હકારાત્મક ઊર્જા આમંત્રિત કરવા માંગતા હોવ, અમે આ પ્રક્રિયામાં તમને માર્ગદર્શન આપી શકીએ છીએ.</p>'
    },
    image: `${BASE_IMG}/all_puja.png`,
    category: 'service',
    order: 16
  }
];

const SITE_SETTINGS_DEFAULTS = {
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

async function run() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set. Please add it to .env.local before running the seed.');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Create admin
  const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Admin.create({
      name: 'Site Admin',
      email: ADMIN_EMAIL,
      passwordHash,
      role: 'superadmin'
    });
    console.log(`Created admin account: ${ADMIN_EMAIL}`);
  } else {
    console.log(`Admin account already exists: ${ADMIN_EMAIL}`);
  }

  // Create services
  for (const svc of services) {
    const exists = await Service.findOne({ slug: svc.slug });
    if (!exists) {
      await Service.create(svc);
      console.log(`Created service: ${svc.slug}`);
    } else {
      console.log(`Service already exists: ${svc.slug}`);
    }
  }

  // Create default site settings (only if none exists yet, so it never
  // overwrites content the client has already edited from the admin panel)
  const existingSettings = await SiteSettings.findById('site');
  if (!existingSettings) {
    await SiteSettings.create(SITE_SETTINGS_DEFAULTS);
    console.log('Created default site settings (home page, about, USA/Canada/UK pages, locations, etc.)');
  } else {
    console.log('Site settings already exist - leaving your edits untouched.');
  }

  console.log('Seeding complete.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
