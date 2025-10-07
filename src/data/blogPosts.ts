export interface BlogPost {
  id: string;
  title: string;
  titleTa: string;
  excerpt: string;
  excerptTa: string;
  content: string;
  contentTa: string;
  date: string;
  readTime: string;
  category: string;
  categoryTa: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "kaya-kalpa-rejuvenation",
    title: "The Power of Kaya Kalpa: Rejuvenation through Siddha",
    titleTa: "காயகல்பத்தின் சக்தி: சித்த மருத்துவம் மூலம் புத்துயிர்",
    excerpt: "Discover the ancient Siddha practice of Kaya Kalpa and how it can help you achieve vitality, longevity, and mental clarity naturally.",
    excerptTa: "காயகல்பத்தின் பழமையான சித்த நடைமுறையை கண்டறியுங்கள், இது உங்களுக்கு உயிர்ச்சக்தி, நீண்ட ஆயுள் மற்றும் மனத் தெளிவை இயற்கையாக அடைய உதவும்.",
    date: "March 15, 2025",
    readTime: "5 min read",
    category: "Rejuvenation",
    categoryTa: "புத்துயிர்",
    content: `<h2>Understanding Kaya Kalpa</h2>
<p>Kaya Kalpa is an ancient Siddha rejuvenation therapy that aims to restore youthfulness, vitality, and longevity. The term "Kaya" means body, and "Kalpa" means transformation or renewal. This powerful practice has been used by Siddha masters for centuries to achieve optimal health and extend lifespan.</p>

<h3>The Science Behind Kaya Kalpa</h3>
<p>Kaya Kalpa works on multiple levels:</p>
<ul>
<li><strong>Cellular Rejuvenation:</strong> Helps remove toxins and regenerate cells</li>
<li><strong>Hormonal Balance:</strong> Restores proper hormone function</li>
<li><strong>Mental Clarity:</strong> Enhances cognitive function and memory</li>
<li><strong>Physical Strength:</strong> Improves stamina and vitality</li>
</ul>

<h3>Who Can Benefit?</h3>
<p>Kaya Kalpa is particularly beneficial for:</p>
<ul>
<li>Individuals experiencing premature aging</li>
<li>Those with chronic fatigue or low energy</li>
<li>People seeking mental clarity and focus</li>
<li>Anyone interested in preventive health care</li>
</ul>

<h3>The Kaya Kalpa Process</h3>
<p>A typical Kaya Kalpa therapy involves:</p>
<ol>
<li><strong>Preparation Phase:</strong> Detoxification and dietary modifications</li>
<li><strong>Treatment Phase:</strong> Administration of specialized herbal formulations</li>
<li><strong>Maintenance Phase:</strong> Lifestyle guidance and ongoing support</li>
</ol>

<h3>Expected Benefits</h3>
<p>Regular practitioners of Kaya Kalpa report:</p>
<ul>
<li>Increased energy and vitality</li>
<li>Improved skin texture and glow</li>
<li>Better sleep quality</li>
<li>Enhanced mental focus</li>
<li>Stronger immunity</li>
<li>Delayed signs of aging</li>
</ul>

<p><em>Interested in starting your Kaya Kalpa journey? Book a consultation with Dr. Dhivyadhashini to learn more about personalized rejuvenation therapy.</em></p>`,
    contentTa: `<h2>காயகல்பத்தைப் புரிந்துகொள்ளுதல்</h2>
<p>காயகல்பம் என்பது இளமை, உயிர்ச்சக்தி மற்றும் நீண்ட ஆயுளை மீட்டெடுப்பதை நோக்கமாகக் கொண்ட ஒரு பழமையான சித்த புத்துயிர் சிகிச்சை ஆகும். "காயா" என்றால் உடல், "கல்பம்" என்றால் மாற்றம் அல்லது புதுப்பித்தல். இந்த சக்திவாய்ந்த நடைமுறை சித்த மாஸ்டர்களால் பல நூற்றாண்டுகளாக உகந்த ஆரோக்கியத்தை அடையவும் ஆயுளை நீட்டிக்கவும் பயன்படுத்தப்படுகிறது.</p>

<h3>காயகல்பத்தின் பின்னணியில் உள்ள விஞ்ஞானம்</h3>
<p>காயகல்பம் பல நிலைகளில் செயல்படுகிறது:</p>
<ul>
<li><strong>செல்லுலார் புத்துயிர்:</strong> நச்சுக்களை அகற்றி செல்களை மீளுருவாக்க உதவுகிறது</li>
<li><strong>ஹார்மோன் சமநிலை:</strong> சரியான ஹார்மோன் செயல்பாட்டை மீட்டெடுக்கிறது</li>
<li><strong>மன தெளிவு:</strong> அறிவாற்றல் செயல்பாடு மற்றும் நினைவாற்றலை மேம்படுத்துகிறது</li>
<li><strong>உடல் வலிமை:</strong> சகிப்புத்தன்மை மற்றும் உயிர்ச்சக்தியை மேம்படுத்துகிறது</li>
</ul>

<h3>யார் பயனடையலாம்?</h3>
<p>காயகல்பம் குறிப்பாக பின்வருபவர்களுக்கு பயனுள்ளதாக இருக்கும்:</p>
<ul>
<li>முன்கூட்டியே வயதான தோற்றத்தை அனுபவிப்பவர்கள்</li>
<li>நாள்பட்ட சோர்வு அல்லது குறைந்த ஆற்றல் உள்ளவர்கள்</li>
<li>மனத் தெளிவு மற்றும் கவனம் தேடுபவர்கள்</li>
<li>தடுப்பு சுகாதார பராமரிப்பில் ஆர்வமுள்ள எவரும்</li>
</ul>

<h3>காயகல்ப செயல்முறை</h3>
<p>ஒரு பொதுவான காயகல்ப சிகிச்சையில் பின்வருவன அடங்கும்:</p>
<ol>
<li><strong>தயாரிப்பு கட்டம்:</strong> நச்சு நீக்கம் மற்றும் உணவு மாற்றங்கள்</li>
<li><strong>சிகிச்சை கட்டம்:</strong> சிறப்பு மூலிகை சூத்திரங்களின் நிர்வாகம்</li>
<li><strong>பராமரிப்பு கட்டம்:</strong> வாழ்க்கை முறை வழிகாட்டுதல் மற்றும் தொடர்ச்சியான ஆதரவு</li>
</ol>

<h3>எதிர்பார்க்கப்படும் நன்மைகள்</h3>
<p>காயகல்பத்தின் வழக்கமான பயிற்சியாளர்கள் தெரிவிக்கின்றனர்:</p>
<ul>
<li>அதிகரித்த ஆற்றல் மற்றும் உயிர்ச்சக்தி</li>
<li>மேம்படுத்தப்பட்ட தோல் அமைப்பு மற்றும் பளபளப்பு</li>
<li>சிறந்த தூக்க தரம்</li>
<li>மேம்படுத்தப்பட்ட மன கவனம்</li>
<li>வலுவான நோய் எதிர்ப்பு சக்தி</li>
<li>வயதான அறிகுறிகள் தாமதமாதல்</li>
</ul>

<p><em>உங்கள் காயகல்ப பயணத்தைத் தொடங்க ஆர்வமா? தனிப்பயனாக்கப்பட்ட புத்துயிர் சிகிச்சை பற்றி மேலும் அறிய டாக்டர் திவ்யதர்சினியுடன் ஆலோசனை பதிவு செய்யுங்கள்.</em></p>`
  },
  {
    id: "diet-dosha-balance",
    title: "How Diet Influences Dosha Balance",
    titleTa: "உணவு தோஷ சமநிலையை எவ்வாறு பாதிக்கிறது",
    excerpt: "Learn how the food you eat affects your body's natural balance and how Siddha dietary principles can optimize your health.",
    excerptTa: "நீங்கள் உண்ணும் உணவு உங்கள் உடலின் இயற்கையான சமநிலையை எவ்வாறு பாதிக்கிறது மற்றும் சித்த உணவுக் கொள்கைகள் உங்கள் ஆரோக்கியத்தை எவ்வாறு மேம்படுத்தும் என்பதை அறியுங்கள்.",
    date: "March 10, 2025",
    readTime: "7 min read",
    category: "Nutrition",
    categoryTa: "ஊட்டச்சத்து",
    content: `<h2>Understanding the Three Doshas</h2>
<p>In Siddha medicine, health is maintained through the balance of three vital forces or doshas: Vata (air), Pitta (fire), and Kapha (water). What you eat directly impacts these doshas and consequently your overall health.</p>

<h3>Vata Balancing Foods</h3>
<p><strong>Characteristics:</strong> Dry, light, cold, rough</p>
<p><strong>Best Foods:</strong></p>
<ul>
<li>Warm, cooked foods</li>
<li>Healthy fats and oils</li>
<li>Sweet fruits like bananas and mangoes</li>
<li>Grains like rice and wheat</li>
<li>Warm spices like ginger and cinnamon</li>
</ul>
<p><strong>Foods to Avoid:</strong> Raw vegetables, cold foods, dried fruits</p>

<h3>Pitta Balancing Foods</h3>
<p><strong>Characteristics:</strong> Hot, sharp, light, liquid</p>
<p><strong>Best Foods:</strong></p>
<ul>
<li>Cool, refreshing foods</li>
<li>Sweet fruits like grapes and melons</li>
<li>Leafy greens and vegetables</li>
<li>Cooling herbs like cilantro and mint</li>
<li>Dairy products in moderation</li>
</ul>
<p><strong>Foods to Avoid:</strong> Spicy foods, sour fruits, excessive salt</p>

<h3>Kapha Balancing Foods</h3>
<p><strong>Characteristics:</strong> Heavy, slow, steady, cold</p>
<p><strong>Best Foods:</strong></p>
<ul>
<li>Light, warm foods</li>
<li>Pungent spices</li>
<li>Legumes and beans</li>
<li>Astringent fruits like apples and pears</li>
<li>Bitter and pungent vegetables</li>
</ul>
<p><strong>Foods to Avoid:</strong> Heavy, oily foods, excessive dairy, sweet foods</p>

<h3>Practical Tips for Dosha Balance</h3>
<ol>
<li><strong>Know Your Constitution:</strong> Consult with a Siddha physician to understand your primary dosha</li>
<li><strong>Eat Seasonally:</strong> Adjust your diet according to the season</li>
<li><strong>Practice Mindful Eating:</strong> Eat in a calm environment</li>
<li><strong>Stay Hydrated:</strong> Drink warm water throughout the day</li>
<li><strong>Use Digestive Spices:</strong> Incorporate turmeric, cumin, and coriander</li>
</ol>

<p><em>For personalized dietary guidance based on your unique constitution, book a consultation with Dr. Dhivyadhashini.</em></p>`,
    contentTa: `<h2>மூன்று தோஷங்களைப் புரிந்துகொள்ளுதல்</h2>
<p>சித்த மருத்துவத்தில், மூன்று முக்கிய சக்திகள் அல்லது தோஷங்களின் சமநிலை மூலம் ஆரோக்கியம் பராமரிக்கப்படுகிறது: வாத (காற்று), பித்த (நெருப்பு), மற்றும் கப (நீர்). நீங்கள் உண்ணும் உணவு இந்த தோஷங்களை நேரடியாகப் பாதிக்கிறது மற்றும் அதன் விளைவாக உங்கள் ஒட்டுமொத்த ஆரோக்கியத்தையும் பாதிக்கிறது.</p>

<h3>வாத சமநிலை உணவுகள்</h3>
<p><strong>பண்புகள்:</strong> வறண்ட, இலகுவான, குளிர்ச்சியான, கரடுமுரடான</p>
<p><strong>சிறந்த உணவுகள்:</strong></p>
<ul>
<li>சூடான, சமைக்கப்பட்ட உணவுகள்</li>
<li>ஆரோக்கியமான கொழுப்புகள் மற்றும் எண்ணெய்கள்</li>
<li>வாழைப்பழம் மற்றும் மாம்பழம் போன்ற இனிப்பு பழங்கள்</li>
<li>அரிசி மற்றும் கோதுமை போன்ற தானியங்கள்</li>
<li>இஞ்சி மற்றும் இலவங்கப்பட்டை போன்ற சூடான மசாலாப் பொருட்கள்</li>
</ul>
<p><strong>தவிர்க்க வேண்டிய உணவுகள்:</strong> பச்சை காய்கறிகள், குளிர் உணவுகள், உலர்ந்த பழங்கள்</p>

<h3>பித்த சமநிலை உணவுகள்</h3>
<p><strong>பண்புகள்:</strong> சூடான, கூர்மையான, இலகுவான, திரவ</p>
<p><strong>சிறந்த உணவுகள்:</strong></p>
<ul>
<li>குளிர்ச்சியான, புத்துணர்ச்சியூட்டும் உணவுகள்</li>
<li>திராட்சை மற்றும் முலாம்பழம் போன்ற இனிப்பு பழங்கள்</li>
<li>இலை காய்கறிகள் மற்றும் காய்கறிகள்</li>
<li>கொத்தமல்லி மற்றும் புதினா போன்ற குளிர்ச்சியான மூலிகைகள்</li>
<li>பால் பொருட்கள் மிதமாக</li>
</ul>
<p><strong>தவிர்க்க வேண்டிய உணவுகள்:</strong> காரமான உணவுகள், புளிப்பு பழங்கள், அதிகப்படியான உப்பு</p>

<h3>கப சமநிலை உணவுகள்</h3>
<p><strong>பண்புகள்:</strong> கனமான, மெதுவான, நிலையான, குளிர்</p>
<p><strong>சிறந்த உணவுகள்:</strong></p>
<ul>
<li>இலகுவான, சூடான உணவுகள்</li>
<li>கார மசாலாப் பொருட்கள்</li>
<li>பருப்பு வகைகள் மற்றும் பீன்ஸ்</li>
<li>ஆப்பிள் மற்றும் பேரிக்காய் போன்ற துவர்ப்பு பழங்கள்</li>
<li>கசப்பு மற்றும் கார காய்கறிகள்</li>
</ul>
<p><strong>தவிர்க்க வேண்டிய உணவுகள்:</strong> கனமான, எண்ணெய் உணவுகள், அதிகப்படியான பால், இனிப்பு உணவுகள்</p>

<h3>தோஷ சமநிலைக்கான நடைமுறை குறிப்புகள்</h3>
<ol>
<li><strong>உங்கள் அமைப்பை அறியுங்கள்:</strong> உங்கள் முதன்மை தோஷத்தைப் புரிந்து கொள்ள ஒரு சித்த மருத்துவரை அணுகவும்</li>
<li><strong>பருவகால உணவு:</strong> பருவத்திற்கு ஏற்ப உங்கள் உணவை சரிசெய்யவும்</li>
<li><strong>கவனத்துடன் உண்ணுதல்:</strong> அமைதியான சூழலில் உண்ணுங்கள்</li>
<li><strong>நீரேற்றம்:</strong> நாள் முழுவதும் சூடான நீரை குடிக்கவும்</li>
<li><strong>செரிமான மசாலா பயன்படுத்துங்கள்:</strong> மஞ்சள், சீரகம் மற்றும் கொத்தமல்லி சேர்க்கவும்</li>
</ol>

<p><em>உங்கள் தனித்துவமான அமைப்பின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட உணவு வழிகாட்டுதலுக்கு, டாக்டர் திவ்யதர்சினியுடன் ஆலோசனை பதிவு செய்யுங்கள்.</em></p>`
  },
  {
    id: "natural-stress-remedies",
    title: "Natural Remedies for Stress & Fatigue",
    titleTa: "மன அழுத்தம் மற்றும் சோர்வுக்கான இயற்கை தீர்வுகள்",
    excerpt: "Explore time-tested Siddha herbs and practices that help combat modern stress and restore your energy levels naturally.",
    excerptTa: "நவீன மன அழுத்தத்தை எதிர்த்துப் போராடவும் உங்கள் ஆற்றல் நிலைகளை இயற்கையாக மீட்டெடுக்கவும் உதவும் காலப்போக்கில் சோதிக்கப்பட்ட சித்த மூலிகைகள் மற்றும் நடைமுறைகளை ஆராயுங்கள்.",
    date: "March 5, 2025",
    readTime: "6 min read",
    category: "Wellness",
    categoryTa: "ஆரோக்கியம்",
    content: `<h2>Understanding Stress in Siddha Medicine</h2>
<p>Stress and fatigue are seen as imbalances in the body's vital energies. Siddha medicine offers holistic solutions that address both physical and mental aspects of these conditions.</p>

<h3>Top Siddha Herbs for Stress Relief</h3>

<h4>1. Ashwagandha (Amukkara)</h4>
<p>A powerful adaptogen that helps the body manage stress. Benefits include:</p>
<ul>
<li>Reduces cortisol levels</li>
<li>Improves sleep quality</li>
<li>Enhances mental clarity</li>
<li>Boosts energy naturally</li>
</ul>

<h4>2. Brahmi (Vallarai)</h4>
<p>Known for its calming properties:</p>
<ul>
<li>Reduces anxiety and stress</li>
<li>Improves memory and concentration</li>
<li>Supports nervous system health</li>
<li>Promotes restful sleep</li>
</ul>

<h4>3. Tulsi (Holy Basil)</h4>
<p>A sacred herb with multiple benefits:</p>
<ul>
<li>Natural stress reliever</li>
<li>Boosts immunity</li>
<li>Improves respiratory health</li>
<li>Balances cortisol levels</li>
</ul>

<h3>Lifestyle Practices for Stress Management</h3>

<h4>Daily Routine (Dinacharya)</h4>
<ol>
<li><strong>Morning:</strong> Wake up before sunrise, practice oil pulling, and do light exercises</li>
<li><strong>Midday:</strong> Eat your main meal when the sun is highest</li>
<li><strong>Evening:</strong> Light dinner before sunset, practice relaxation</li>
<li><strong>Night:</strong> Sleep by 10 PM for optimal rest</li>
</ol>

<h4>Breathing Exercises (Pranayama)</h4>
<ul>
<li><strong>Anulom Vilom:</strong> Alternate nostril breathing for 10 minutes</li>
<li><strong>Bhramari:</strong> Humming bee breath for calming the mind</li>
<li><strong>Deep Belly Breathing:</strong> 5 minutes before bed</li>
</ul>

<h4>Meditation and Mindfulness</h4>
<p>Practice daily meditation for at least 15-20 minutes. Focus on breath awareness or use guided meditations.</p>

<h3>Dietary Recommendations</h3>
<ul>
<li>Avoid excessive caffeine and sugar</li>
<li>Include warm, nourishing foods</li>
<li>Eat at regular times</li>
<li>Stay hydrated with warm water</li>
<li>Include stress-busting foods: almonds, bananas, leafy greens</li>
</ul>

<h3>When to Seek Help</h3>
<p>If stress and fatigue persist despite lifestyle changes, consult with a Siddha physician for personalized treatment.</p>

<p><em>Book a consultation with Dr. Dhivyadhashini for a comprehensive stress management plan tailored to your needs.</em></p>`,
    contentTa: `<h2>சித்த மருத்துவத்தில் மன அழுத்தத்தைப் புரிந்துகொள்ளுதல்</h2>
<p>மன அழுத்தம் மற்றும் சோர்வு உடலின் முக்கிய ஆற்றல்களில் ஏற்படும் சமநிலையின்மையாகக் காணப்படுகின்றன. சித்த மருத்துவம் இந்த நிலைமைகளின் உடல் மற்றும் மன அம்சங்களைக் கவனிக்கும் முழுமையான தீர்வுகளை வழங்குகிறது.</p>

<h3>மன அழுத்த நிவாரணத்திற்கான சிறந்த சித்த மூலிகைகள்</h3>

<h4>1. அஸ்வகந்தா (அமுக்கரா)</h4>
<p>மன அழுத்தத்தை நிர்வகிக்க உடலுக்கு உதவும் ஒரு சக்திவாய்ந்த அடாப்டோஜென். நன்மைகள்:</p>
<ul>
<li>கார்டிசால் அளவைக் குறைக்கிறது</li>
<li>தூக்க தரத்தை மேம்படுத்துகிறது</li>
<li>மன தெளிவை மேம்படுத்துகிறது</li>
<li>ஆற்றலை இயற்கையாக அதிகரிக்கிறது</li>
</ul>

<h4>2. பிரம்மி (வல்லாரை)</h4>
<p>அதன் அமைதிப்படுத்தும் பண்புகளுக்கு அறியப்படுகிறது:</p>
<ul>
<li>கவலை மற்றும் மன அழுத்தத்தைக் குறைக்கிறது</li>
<li>நினைவாற்றல் மற்றும் கவனத்தை மேம்படுத்துகிறது</li>
<li>நரம்பு மண்டல ஆரோக்கியத்தை ஆதரிக்கிறது</li>
<li>அமைதியான தூக்கத்தை ஊக்குவிக்கிறது</li>
</ul>

<h4>3. துளசி</h4>
<p>பல நன்மைகளைக் கொண்ட ஒரு புனித மூலிகை:</p>
<ul>
<li>இயற்கையான மன அழுத்த நிவாரணி</li>
<li>நோய் எதிர்ப்பு சக்தியை அதிகரிக்கிறது</li>
<li>சுவாச ஆரோக்கியத்தை மேம்படுத்துகிறது</li>
<li>கார்டிசால் அளவை சமநிலைப்படுத்துகிறது</li>
</ul>

<h3>மன அழுத்த மேலாண்மைக்கான வாழ்க்கை முறை நடைமுறைகள்</h3>

<h4>தினசரி வழக்கம் (தினச்சரியா)</h4>
<ol>
<li><strong>காலை:</strong> சூரிய உதயத்திற்கு முன் எழுந்திருங்கள், எண்ணெய் இழுத்தல் பயிற்சி செய்யுங்கள், இலகுவான உடற்பயிற்சிகள் செய்யுங்கள்</li>
<li><strong>மதியம்:</strong> சூரியன் மிக உயரத்தில் இருக்கும் போது உங்கள் முக்கிய உணவை உண்ணுங்கள்</li>
<li><strong>மாலை:</strong> சூரிய அஸ்தமனத்திற்கு முன் இலகுவான இரவு உணவு, தளர்வு பயிற்சி செய்யுங்கள்</li>
<li><strong>இரவு:</strong> உகந்த ஓய்வுக்காக இரவு 10 மணிக்குள் தூங்குங்கள்</li>
</ol>

<h4>சுவாச பயிற்சிகள் (பிராணாயாமம்)</h4>
<ul>
<li><strong>அனுலோம் விலோம்:</strong> 10 நிமிடங்களுக்கு மாற்று நாசி சுவாசம்</li>
<li><strong>பிரமாரி:</strong> மனதை அமைதிப்படுத்த ஹம்மிங் பீ சுவாசம்</li>
<li><strong>ஆழமான வயிறு சுவாசம்:</strong> படுக்கைக்கு முன் 5 நிமிடங்கள்</li>
</ul>

<h4>தியானம் மற்றும் கவனத்துடன் இருத்தல்</h4>
<p>தினமும் குறைந்தது 15-20 நிமிடங்களுக்கு தியானம் செய்யுங்கள். சுவாச விழிப்புணர்வில் கவனம் செலுத்துங்கள் அல்லது வழிகாட்டப்பட்ட தியானங்களைப் பயன்படுத்துங்கள்.</p>

<h3>உணவு பரிந்துரைகள்</h3>
<ul>
<li>அதிகப்படியான காஃபின் மற்றும் சர்க்கரையைத் தவிர்க்கவும்</li>
<li>சூடான, ஊட்டமளிக்கும் உணவுகளை சேர்க்கவும்</li>
<li>வழக்கமான நேரங்களில் உண்ணுங்கள்</li>
<li>சூடான நீரால் நீரேற்றமாக இருங்கள்</li>
<li>மன அழுத்தத்தை எதிர்க்கும் உணவுகளைச் சேர்க்கவும்: பாதாம், வாழைப்பழங்கள், இலை காய்கறிகள்</li>
</ul>

<h3>உதவி தேட வேண்டிய நேரம்</h3>
<p>வாழ்க்கை முறை மாற்றங்கள் இருந்தபோதிலும் மன அழுத்தம் மற்றும் சோர்வு தொடர்ந்தால், தனிப்பயனாக்கப்பட்ட சிகிச்சைக்காக ஒரு சித்த மருத்துவரை அணுகவும்.</p>

<p><em>உங்கள் தேவைகளுக்கு ஏற்ப வடிவமைக்கப்பட்ட விரிவான மன அழுத்த மேலாண்மை திட்டத்திற்காக டாக்டர் திவ்யதர்சினியுடன் ஆலோசனை பதிவு செய்யுங்கள்.</em></p>`
  }
];
