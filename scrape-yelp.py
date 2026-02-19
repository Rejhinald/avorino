from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from time import sleep
import json

def scrape_yelp_reviews(url, max_pages=4):
    options = webdriver.ChromeOptions()
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36')
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)

    browser = webdriver.Chrome(options=options)
    browser.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {
        'source': 'Object.defineProperty(navigator, "webdriver", {get: () => undefined})'
    })

    review_data = []

    try:
        browser.get(url)
        print(f"Loaded page: {browser.title}")

        # Wait for page to fully load
        sleep(12)

        # Scroll down to trigger lazy loading
        browser.execute_script("window.scrollTo(0, document.body.scrollHeight / 2)")
        sleep(3)
        browser.execute_script("window.scrollTo(0, document.body.scrollHeight)")
        sleep(3)
        browser.execute_script("window.scrollTo(0, 0)")
        sleep(2)

        for page_num in range(max_pages):
            print(f"\nScraping page {page_num + 1}...")
            sleep(5)

            html = browser.page_source
            soup = BeautifulSoup(html, 'lxml')

            # Debug: save page source on first page
            if page_num == 0:
                with open('yelp-debug.html', 'w', encoding='utf-8') as f:
                    f.write(html)
                print("Saved debug HTML")

            # Find all review containers - try multiple strategies
            # Strategy 1: Look for review list items
            all_reviews = []

            # Find by data-review-id or similar
            review_items = soup.find_all(['li', 'div'], attrs={'class': True})
            for item in review_items:
                classes = ' '.join(item.get('class', []))
                # Look for items that contain both a rating and text
                has_rating = item.find('div', {'role': 'img'}) or item.find('div', attrs={'aria-label': lambda x: x and 'star' in str(x).lower()})
                has_text = item.find('p', {'class': True})
                has_user = item.find('a', href=lambda x: x and '/user_details' in str(x))

                if has_rating and has_text and has_user:
                    all_reviews.append(item)

            print(f"Found {len(all_reviews)} review elements")

            for review in all_reviews:
                try:
                    # Name from user link
                    user_link = review.find('a', href=lambda x: x and '/user_details' in str(x))
                    name = user_link.text.strip() if user_link else 'Unknown'

                    # Address - look for location text near user
                    address = ''
                    user_passport = review.find('div', {'class': lambda c: c and 'user-passport' in str(c)})
                    if user_passport:
                        divs = user_passport.find_all('div')
                        for d in divs:
                            text = d.get_text(strip=True)
                            if ',' in text and len(text) < 50:
                                address = text
                                break

                    # Rating
                    rating_el = review.find('div', {'role': 'img'})
                    if not rating_el:
                        rating_el = review.find('div', attrs={'aria-label': lambda x: x and 'star' in str(x).lower()})
                    rating = rating_el.get('aria-label', '') if rating_el else ''

                    # Date
                    date = ''
                    spans = review.find_all('span')
                    for span in spans:
                        text = span.get_text(strip=True)
                        # Look for date patterns
                        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        if any(m in text for m in months) and any(c.isdigit() for c in text) and len(text) < 20:
                            date = text
                            break

                    # Comment
                    comment_el = review.find('p')
                    comment = ''
                    if comment_el:
                        # Get all text including nested spans
                        comment = comment_el.get_text(strip=True)

                    if comment and len(comment) > 15 and name != 'Unknown':
                        review_data.append({
                            'Name': name,
                            'Address': address,
                            'Rating': rating,
                            'Date': date,
                            'Comment': comment
                        })
                        print(f"  + {name} ({rating}): {comment[:70]}...")

                except Exception as e:
                    print(f"  Error parsing review: {e}")
                    continue

            # Try next page
            try:
                next_btn = browser.find_element(By.CSS_SELECTOR, 'a[aria-label="Next"]')
                browser.execute_script("arguments[0].click();", next_btn)
                print("Navigating to next page...")
                sleep(8)
            except:
                print("No more pages found.")
                break

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        browser.quit()

    return review_data


if __name__ == "__main__":
    url = "https://www.yelp.com/biz/avorino-custom-home-and-adu-irvine"
    print(f"Scraping reviews from: {url}")
    reviews = scrape_yelp_reviews(url, max_pages=4)
    print(f"\nTotal reviews scraped: {len(reviews)}")

    output_file = "avorino-yelp-reviews.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(reviews, f, indent=2, ensure_ascii=False)
    print(f"Saved to {output_file}")
