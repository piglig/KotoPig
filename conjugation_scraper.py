# -*- coding: utf-8 -*-
import requests
from bs4 import BeautifulSoup
import json
import time
import random

# --- 1. 精心准备的高频词例句 ---
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

# --- 2. 从外部文件读取动词列表 ---
def load_verb_list(filename="japanese_verbs.txt"):
    verbs = []
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            for line in f:
                verb = line.strip()
                if verb: # 确保不是空行
                    verbs.append(verb)
    except FileNotFoundError:
        print(f"Error: {filename} not found. Please create it with a list of verbs.")
    return verbs

# --- 3. 活用抓取逻辑 ---

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def parse_conjugation_page(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    forms = {}
    
    # 查找包含活用表格的区域
    conjugation_table = soup.find('table', class_='verb-conjugation-table')
    if not conjugation_table:
        return forms

    rows = conjugation_table.find_all('tr')
    for row in rows:
        cols = row.find_all('td')
        if len(cols) >= 2:
            form_name_raw = cols[0].text.strip()
            form_value = cols[1].text.strip()
            
            # 映射到我们需要的形式名称
            mapped_name = ""
            if "Dictionary Form" in form_name_raw: mapped_name = "dictionary_form"
            elif "Masu Form" in form_name_raw: mapped_name = "masu_form"
            elif "Te Form" in form_name_raw: mapped_name = "te_form"
            elif "Negative Form" in form_name_raw: mapped_name = "nai_form"
            elif "Past Form" in form_name_raw: mapped_name = "past_form"
            elif "Volitional Form" in form_name_raw: mapped_name = "volitional_form"
            elif "Potential Form" in form_name_raw: mapped_name = "potential_form"
            elif "Passive Form" in form_name_raw: mapped_name = "passive_form"
            elif "Conditional (ba) Form" in form_name_raw: mapped_name = "conditional_ba_form"
            elif "Imperative Form" in form_name_raw: mapped_name = "imperative_form"
            elif "Causative Form" in form_name_raw: mapped_name = "causative_form"
            
            if mapped_name: forms[mapped_name] = form_value
            
    return forms

def get_verb_details(verb_dict_form):
    base_url = "https://www.japaneseverbconjugator.com/VerbDetails.asp?txtVerb="
    url = base_url + requests.utils.quote(verb_dict_form) # URL编码
    
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status() # 检查HTTP错误
        
        # 确保BeautifulSoup使用正确的编码
        soup = BeautifulSoup(response.content, 'html.parser', from_encoding='utf-8')
        
        # 提取读音 (kana)
        reading = ""
        reading_tag = soup.find('span', class_='kana')
        if reading_tag: reading = reading_tag.text.strip()

        # 提取释义 (meaning)
        meaning = ""
        meaning_tag = soup.find('span', class_='english')
        if meaning_tag: meaning = meaning_tag.text.strip()

        # 提取动词类型 (group) 和 JLPT Level
        group = "Unknown"
        jlpt_level = "Unknown"
        
        # 查找包含动词类型信息的标签
        type_tag = soup.find('span', class_='verb-type')
        if type_tag:
            type_text = type_tag.text.strip().lower()
            if "ichidan" in type_text: group = "ichidan"
            elif "godan" in type_text: group = "godan"
            elif "suru" in type_text: group = "suru"
            elif "kuru" in type_text: group = "kuru"

        forms = parse_conjugation_page(response.content)
        
        return {
            "verb": verb_dict_form,
            "reading": reading,
            "meaning": meaning,
            "jlpt_level": jlpt_level,
            "group": group,
            "forms": forms,
            "examples": CURATED_EXAMPLES.get(verb_dict_form, [])
        }
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

def main():
    print("--- Starting Japanese Verb Conjugation Scraper ---")
    
    verbs_to_scrape = load_verb_list()
    if not verbs_to_scrape:
        print("No verbs found in japanese_verbs.txt. Exiting.")
        return

    all_verbs_data = []
    
    for verb in verbs_to_scrape:
        print(f"Processing verb: {verb}")
        details = get_verb_details(verb)
        if details:
            all_verbs_data.append(details)
            print(f"  - Successfully processed {verb}.")
        else:
            print(f"  - Failed to process {verb}. Skipping.")
        
        time.sleep(random.uniform(1, 2)) # 随机延迟，避免被封

    output_filename = 'public/verbs.json'
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(all_verbs_data, f, ensure_ascii=False, indent=2)

    print(f"\n--- All Done! ---")
    print(f"Successfully scraped {len(all_verbs_data)} verbs.")
    print(f"Data saved to {output_filename}")

if __name__ == '__main__':
    main()
