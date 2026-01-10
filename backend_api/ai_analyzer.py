
import os
from typing import Dict, List, Optional
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class AIVideoAnalyzer:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key not found. Set OPENAI_API_KEY in environment.")
        
        self.client = OpenAI(api_key=self.api_key)
        self.model = "gpt-4o-mini"
    
    def analyze_video(self, video: Dict) -> Dict[str, any]:
        prompt = f"""Analyze this YouTube video and provide insights:

Title: {video.get('title', 'Unknown')}
Views: {video.get('views', 0):,}
Likes: {video.get('likes', 0):,}
Comments: {video.get('comments', 0):,}
Virality Score: {video.get('viralityScore', 0)}/100
Country: {video.get('country', 'Unknown')}

Provide a brief analysis (2-3 sentences) covering:
1. Why this video is performing well (or not)
2. Key success factors
3. One specific improvement suggestion

Be concise, actionable, and data-driven."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a YouTube analytics expert. Provide concise, data-driven insights."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            analysis = response.choices[0].message.content
            
            return {
                'success': True,
                'analysis': analysis,
                'tokens_used': response.usage.total_tokens
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'analysis': 'AI analysis unavailable'
            }
    
    def generate_title_suggestions(self, topic: str, count: int = 5) -> List[Dict]:
        prompt = f"""Generate {count} viral YouTube video title suggestions for the topic: "{topic}"

Requirements:
- Each title should be 40-60 characters
- Include emotional hooks or curiosity gaps
- Be specific and actionable
- Avoid excessive clickbait

For each title, estimate viral potential (0-100) based on:
- Emotional appeal
- Specificity
- Trend alignment
- CTR potential

Format: 
Title | Score

Example:
I Survived 100 Days in Minecraft Hardcore | 88"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a viral content strategist specializing in YouTube optimization."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=400,
                temperature=0.8
            )
            
            content = response.choices[0].message.content
            print(f"[AI] Raw response: {content[:200]}...")
            suggestions = []
            
            for line in content.strip().split('\n'):
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                
                import re
                line = re.sub(r'^\d+[\.\)]\s*', '', line)
                
                if '|' in line:
                    parts = line.split('|')
                    if len(parts) >= 2:
                        title = parts[0].strip()
                        score_text = parts[1].strip()
                        try:
                            score = int(re.search(r'\d+', score_text).group())
                            suggestions.append({'title': title, 'predicted_virality': score})
                        except:
                            continue
                elif '-' in line and len(line.split('-')) >= 2:
                    parts = line.rsplit('-', 1)  # Split from right
                    title = parts[0].strip()
                    try:
                        score = int(re.search(r'\d+', parts[1]).group())
                        if len(title) > 10 and 0 <= score <= 100:
                            suggestions.append({'title': title, 'predicted_virality': score})
                    except:
                        continue
                elif '(' in line and ')' in line:
                    # Format: Title (85%)
                    match = re.match(r'(.+?)\s*\((\d+)', line)
                    if match:
                        title = match.group(1).strip()
                        score = int(match.group(2))
                        if len(title) > 10:
                            suggestions.append({'title': title, 'predicted_virality': score})
            
            if not suggestions:
                print("[AI] Parsing failed, generating fallback suggestions...")
                suggestions = [
                    {'title': f"{topic.title()} - Complete Guide for Beginners", 'predicted_virality': 75},
                    {'title': f"How to Master {topic.title()} in 2025", 'predicted_virality': 80},
                    {'title': f"{topic.title()} Tips You NEED to Know", 'predicted_virality': 72},
                    {'title': f"I Tried {topic.title()} for 30 Days - Results!", 'predicted_virality': 85},
                    {'title': f"{topic.title()} Explained in 5 Minutes", 'predicted_virality': 78},
                ]
            
            return {
                'success': True,
                'suggestions': suggestions[:5],
                'tokens_used': response.usage.total_tokens
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'suggestions': []
            }
    
    def extract_trending_topics(self, videos: List[Dict], top_n: int = 10) -> Dict:
        sample_titles = [v.get('title', '') for v in videos[:50] if v.get('title')]
        titles_text = '\n'.join([f"- {title}" for title in sample_titles])
        
        prompt = f"""Analyze these {len(sample_titles)} YouTube video titles and identify the top {top_n} trending topics/themes:

{titles_text}

Provide:
1. Top {top_n} topics (one word or short phrase each)
2. Brief explanation why each is trending
3. Estimated percentage of videos for each topic

Format as JSON:
{{
  "topics": [
    {{"name": "Music Videos", "percentage": 35, "reason": "High engagement, emotional content"}},
    ...
  ]
}}"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a data analyst specializing in content trends. Return valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.5,
                response_format={"type": "json_object"}
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            
            return {
                'success': True,
                'topics': result.get('topics', []),
                'tokens_used': response.usage.total_tokens
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'topics': []
            }
    
    def generate_insights(self, dataset_summary: Dict) -> str:
        prompt = f"""Analyze this YouTube dataset and provide 3-5 key insights:

Dataset Stats:
- Total Videos: {dataset_summary.get('total_videos', 0):,}
- Average Views: {dataset_summary.get('avg_views', 0):,}
- Top Countries: {', '.join(dataset_summary.get('top_countries', [])[:5])}
- Date Range: {dataset_summary.get('date_range', 'Unknown')}
- Avg Engagement: {dataset_summary.get('avg_engagement', 0):.2f}%

Provide insights in this format:
• Insight 1 (one sentence with specific number/percentage)
• Insight 2 (one sentence with specific number/percentage)
• Insight 3 (one sentence with specific number/percentage - when mentioning countries, use their FULL NAMES, not codes)
• Insight 4 (one sentence with specific number/percentage)

IMPORTANT: When mentioning countries in insights, always use their FULL NAMES (e.g., "Japan, Indonesia, Malaysia" NOT "JP, ID, MY"). List all country names mentioned, not just abbreviations.

Focus on actionable patterns and surprising findings."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a data scientist. Provide concise, numbered insights with specific metrics."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.6
            )
            
            return {
                'success': True,
                'insights': response.choices[0].message.content,
                'tokens_used': response.usage.total_tokens
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'insights': 'AI insights unavailable'
            }
    
    def explain_virality_score(self, video: Dict) -> str:
        prompt = f"""Explain why this video has a virality score of {video.get('viralityScore', 0)}/100:

Video: {video.get('title', 'Unknown')}
Views: {video.get('views', 0):,}
Likes: {video.get('likes', 0):,}
Comments: {video.get('comments', 0):,}
Engagement Rate: {((video.get('likes', 0) + video.get('comments', 0)) / max(video.get('views', 1), 1)) * 100:.2f}%
Growth Velocity: {video.get('growthVelocity', 0)}/100
Audience Reach: {video.get('audienceReach', 0)}/100
Trending Duration: {video.get('trendingDuration', 0)}/100

Provide a 2-3 sentence explanation covering:
1. Main strength (what's working well)
2. Main weakness (what could improve)
3. One specific actionable tip

Be encouraging but honest."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a YouTube growth consultant. Explain virality scores in simple terms."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            return {
                'success': True,
                'explanation': response.choices[0].message.content,
                'tokens_used': response.usage.total_tokens
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'explanation': 'AI explanation unavailable'
            }


if __name__ == "__main__":
    print("\n" + "="*70)
    print("  AI VIDEO ANALYZER - TEST")
    print("="*70)
    
    try:
        analyzer = AIVideoAnalyzer()
        print("\n[OK] OpenAI connection successful!")
        print(f"[OK] Using model: {analyzer.model}")
        
        test_video = {
            'title': 'MrBeast - I Survived 100 Days in a Circle',
            'views': 50_000_000,
            'likes': 2_500_000,
            'comments': 150_000,
            'viralityScore': 92,
            'country': 'US'
        }
        
        print("\n[TEST] Analyzing video...")
        result = analyzer.analyze_video(test_video)
        
        if result['success']:
            print(f"\n[AI ANALYSIS]")
            print(result['analysis'])
            print(f"\nTokens used: {result['tokens_used']}")
        else:
            print(f"\n[ERROR] {result['error']}")
        
        print("\n" + "="*70)
        
    except Exception as e:
        print(f"\n[ERROR] {e}")
        print("\nMake sure OPENAI_API_KEY is set in .env file")

