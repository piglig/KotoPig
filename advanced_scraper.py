import requests
from bs4 import BeautifulSoup
import json
import time
import random

# --- 1. 精心准备的高频词例句 (可扩充) ---
CURATED_EXAMPLES = {
    "食べる": [
        {
            "japanese": "毎日、日本語を勉強します。",
            "reading": "まいにち、にほんごをべんきょうします。",
            "translation": "我每天学习日语。"
        }
    ],
    "飲む": [
        {
            "japanese": "水を飲みます。",
            "reading": "みずをのみます。",
            "translation": "喝水。"
        }
    ],
    "する": [
        {
            "japanese": "宿題をします。",
            "reading": "しゅくだいをします。",
            "translation": "做作业。"
        }
    ],
    "来る": [
        {
            "japanese": "明日、友達が来ます。",
            "reading": "あした、ともだちがきます。",
            "translation": "明天朋友要来。"
        }
    ],
    "見る": [
        {
            "japanese": "テレビを見ます。",
            "reading": "テレビをみます。",
            "translation": "看电视。"
        }
    ],
    "行く": [
        {
            "japanese": "週末、京都へ行きます。",
            "reading": "しゅうまつ、きょうとへいきます。",
            "translation": "周末去京都。"
        }
    ],
    "話す": [
        {
            "japanese": "彼は英語を上手に話します。",
            "reading": "かれはえいごをじょうずにはなします。",
            "translation": "他英语说得很好。"
        }
    ]
}

# --- 2. 内置的基础动词列表 (替代方案) ---
VERB_LIST = [
    # N5
    "会う", "開く", "遊ぶ", "浴びる", "洗う", "ある", "歩く", "言う", "行く", "要る",
    "入れる", "歌う", "生まれる", "売る", "起きる", "置く", "教える", "押す", "覚える", "泳ぐ",
    "降りる", "終わる", "買う", "返す", "帰る", "かかる", "書く", "かける", "貸す", "被る",
    "借りる", "消える", "聞く", "切る", "着る", "来る", "消す", "答える", "困る", "咲く",
    "差す", "死ぬ", "閉まる", "締める", "知る", "吸う", "住む", "する", "座る", "立つ",
    "頼む", "食べる", "違う", "使う", "疲れる", "着く", "作る", "点ける", "勤める", "出かける",
    "できる", "出る", "飛ぶ", "撮る", "止まる", "取る", "鳴く", "並ぶ", "並べる", "なる",
    "脱ぐ", "寝る", "登る", "飲む", "乗る", "入る", "履く", "始まる", "働く", "話す",
    "貼る", "晴れる", "引く", "弾く", "吹く", "降る", "曲がる", "待つ", "磨く", "見る",
    "見せる", "持つ", "休む", "やる", "呼ぶ", "読む", "分かる", "忘れる", "渡す", "渡る",
    # N4 (部分)
    "上げる", "集まる", "謝る", "生きる", "急ぐ", "いただく", "祈る", "動く", "選ぶ", "写す",
    "送る", "遅れる", "起こす", "行う", "怒る", "落ちる", "驚く", "踊る", "思う", "思い出す"
]

# --- 3. 抓取逻辑 ---

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def parse_verb_page(verb, soup):
    print(f"  - Parsing page for {verb}...")
    main_section = soup.find('div', class_='concept_light-representation')
    if not main_section:
        print(f"    - Could not find main content for {verb}. Skipping.")
        return None

    furigana_tag = main_section.find('span', class_='furigana')
    if not furigana_tag:
        print(f"    - Could not find furigana for {verb}. Skipping.")
        return None
    furigana_spans = furigana_tag.find_all('span')
    reading = ''.join([span.text for span in furigana_spans])

    meaning_div = main_section.find('div', class_='meaning-wrapper')
    if not meaning_div:
        print(f"    - Could not find meaning for {verb}. Skipping.")
        return None
    meanings = [m.text.strip() for m in meaning_div.find_all('span', class_='meaning-meaning')]
    meaning = '; '.join(meanings)

    tags = soup.find_all('div', class_='concept_light-tag')
    jlpt_level = "Unknown"
    group = "Unknown"
    for tag in tags:
        tag_text = tag.text.strip()
        if 'JLPT' in tag_text:
            jlpt_level = tag_text.replace('JLPT', '').strip()
        if 'verb' in tag_text:
            if 'Ichidan' in tag_text:
                group = 'ichidan'
            elif 'Godan' in tag_text:
                group = 'godan'
            elif 'Suru' in tag_text:
                group = 'suru'
            elif 'Kuru' in tag_text:
                group = 'kuru'

    forms = {}
    inflection_table = soup.find('div', id='inflections')
    if inflection_table:
        rows = inflection_table.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            if len(cells) == 2:
                form_name_raw = cells[0].text.strip().lower().replace('-', ' ').replace(' ', '_')
                form_name = f"{form_name_raw}_form"
                form_value = cells[1].text.strip().split('\n')[0].strip()
                forms[form_name] = form_value

    if not forms:
        print(f"    - No inflections found for {verb}. It might not be a verb. Skipping.")
        return None

    verb_data = {
        "verb": verb,
        "reading": reading,
        "meaning": meaning,
        "jlpt_level": jlpt_level,
        "group": group,
        "forms": forms,
        "examples": CURATED_EXAMPLES.get(verb, [])
    }
    return verb_data

def main():
    print("--- Starting Advanced Japanese Verb Scraper ---")
    
    all_verbs_data = []
    scraped_verbs = set()

    for verb in VERB_LIST:
        if verb in scraped_verbs:
            continue
        
        print(f"\nProcessing verb: {verb}")
        scraped_verbs.add(verb)

        sleep_time = random.uniform(1, 2.5)
        print(f"  - Waiting for {sleep_time:.2f} seconds...")
        time.sleep(sleep_time)

        jisho_url = f"https://jisho.org/word/{verb}"
        try:
            jisho_response = requests.get(jisho_url, headers=HEADERS, timeout=15)
            if jisho_response.status_code == 200:
                jisho_soup = BeautifulSoup(jisho_response.content, 'html.parser')
                verb_data = parse_verb_page(verb, jisho_soup)
                if verb_data:
                    all_verbs_data.append(verb_data)
                    print(f"  - Successfully parsed and added {verb}.")
            else:
                print(f"  - Failed to fetch Jisho page for {verb} (Status: {jisho_response.status_code})")
        except requests.exceptions.RequestException as e:
            print(f"  - An error occurred while fetching {verb}: {e}")

    output_filename = 'verbs_full.json'
    # Explicitly use utf-8 encoding when writing the file
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(all_verbs_data, f, ensure_ascii=False, indent=2)

    print(f"\n--- All Done! ---")
    print(f"Successfully scraped {len(all_verbs_data)} verbs.")
    print(f"Data saved to {output_filename}")

if __name__ == '__main__':
    main()
