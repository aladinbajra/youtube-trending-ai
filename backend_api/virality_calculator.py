
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import pandas as pd
import numpy as np


class ViralityCalculator:
    WEIGHTS = {
        'growth_velocity': 0.40,
        'engagement_rate': 0.30,
        'trending_duration': 0.20,
        'audience_reach': 0.10,
    }
    
    @staticmethod
    def calculate_growth_velocity(
        view_history: List[Dict],
        days_window: int = 7
    ) -> float:
        if not view_history or len(view_history) < 2:
            return 50.0
        history = sorted(view_history, key=lambda x: x['timestamp'])
        growth_rates = []
        for i in range(1, len(history)):
            prev_views = history[i-1]['views']
            curr_views = history[i]['views']
            
            if prev_views > 0:
                growth_rate = ((curr_views - prev_views) / prev_views) * 100
                growth_rates.append(growth_rate)
        
        if not growth_rates:
            return 50.0
        avg_growth = np.mean(growth_rates)
        recent_growth = np.mean(growth_rates[-3:]) if len(growth_rates) >= 3 else avg_growth
        acceleration = recent_growth / (avg_growth + 1)
        score = min(100, max(0, 50 + (avg_growth * 2) + (acceleration * 10)))
        
        return round(score, 2)
    
    @staticmethod
    def calculate_engagement_rate(
        views: int,
        likes: int,
        comments: int,
        dislikes: int = 0
    ) -> float:
        if views == 0:
            return 0.0
        engagements = likes + comments
        engagement_rate = (engagements / views) * 100
        if engagement_rate < 3:
            score = (engagement_rate / 3) * 50
        elif engagement_rate < 6:
            score = 50 + ((engagement_rate - 3) / 3) * 25
        elif engagement_rate < 10:
            score = 75 + ((engagement_rate - 6) / 4) * 15
        else:
            score = 90 + min(10, (engagement_rate - 10) / 2)
        
        return round(score, 2)
    
    @staticmethod
    def calculate_trending_duration(
        collection_dates: List[str],
        total_days_tracked: int = 90
    ) -> float:
        if not collection_dates:
            return 0.0
        dates = [datetime.fromisoformat(d.replace('Z', '+00:00')) for d in collection_dates]
        dates = sorted(dates)
        if len(dates) == 1:
            days_trending = 1
        else:
            days_trending = (dates[-1] - dates[0]).days + 1
        if days_trending < 7:
            score = 30 + (days_trending / 7) * 30
        elif days_trending < 14:
            score = 60 + ((days_trending - 7) / 7) * 20
        else:
            score = 80 + min(20, ((days_trending - 14) / 30) * 20)
        
        return round(score, 2)
    
    @staticmethod
    def calculate_audience_reach(
        views: int,
        subscribers: Optional[int] = None,
        channel_category: str = 'general'
    ) -> float:
        if views == 0:
            return 0.0
        benchmarks = {
            'music': 0.15,      # Music videos get high views
            'gaming': 0.08,
            'entertainment': 0.10,
            'news': 0.05,
            'education': 0.06,
            'general': 0.07,
        }
        
        benchmark = benchmarks.get(channel_category, 0.07)
        
        if subscribers and subscribers > 0:
            reach_ratio = views / subscribers
            score = (reach_ratio / benchmark) * 50
            
            if reach_ratio > 1.0:
                bonus = min(30, (reach_ratio - 1.0) * 10)
                score += bonus
        else:
            if views >= 1_000_000:
                score = 80 + min(20, (views / 10_000_000) * 20)
            elif views >= 100_000:
                score = 60 + ((views - 100_000) / 900_000) * 20
            else:
                score = (views / 100_000) * 60
        
        return round(min(100, score), 2)
    
    @classmethod
    def calculate_virality_score(
        cls,
        video_data: Dict,
        view_history: Optional[List[Dict]] = None,
        collection_dates: Optional[List[str]] = None
    ) -> Dict[str, float]:
        views = video_data.get('views', 0)
        likes = video_data.get('likes', 0)
        comments = video_data.get('comments', 0)
        subscribers = video_data.get('subscribers')
        growth_velocity = cls.calculate_growth_velocity(
            view_history or []
        )
        
        engagement_rate = cls.calculate_engagement_rate(
            views, likes, comments
        )
        
        trending_duration = cls.calculate_trending_duration(
            collection_dates or []
        )
        
        audience_reach = cls.calculate_audience_reach(
            views, subscribers
        )
        virality_score = (
            growth_velocity * cls.WEIGHTS['growth_velocity'] +
            engagement_rate * cls.WEIGHTS['engagement_rate'] +
            trending_duration * cls.WEIGHTS['trending_duration'] +
            audience_reach * cls.WEIGHTS['audience_reach']
        )
        
        return {
            'virality_score': round(virality_score, 2),
            'growth_velocity': growth_velocity,
            'engagement_rate': engagement_rate,
            'trending_duration': trending_duration,
            'audience_reach': audience_reach,
        }


def get_virality_level(score: float) -> str:
    if score >= 90:
        return "Highly Viral"
    elif score >= 75:
        return "Viral"
    elif score >= 60:
        return "Trending"
    elif score >= 40:
        return "Growing"
    else:
        return "Normal"


if __name__ == "__main__":
    video = {
        'views': 5_000_000,
        'likes': 250_000,
        'comments': 15_000,
        'subscribers': 1_000_000,
    }
    history = [
        {'timestamp': '2025-10-20T00:00:00Z', 'views': 100_000},
        {'timestamp': '2025-10-21T00:00:00Z', 'views': 500_000},
        {'timestamp': '2025-10-22T00:00:00Z', 'views': 1_500_000},
        {'timestamp': '2025-10-23T00:00:00Z', 'views': 3_000_000},
        {'timestamp': '2025-10-24T00:00:00Z', 'views': 4_200_000},
        {'timestamp': '2025-10-25T00:00:00Z', 'views': 5_000_000},
    ]
    
    collection_dates = [
        '2025-10-20T00:00:00Z',
        '2025-10-21T00:00:00Z',
        '2025-10-22T00:00:00Z',
        '2025-10-23T00:00:00Z',
        '2025-10-24T00:00:00Z',
        '2025-10-25T00:00:00Z',
    ]
    calculator = ViralityCalculator()
    result = calculator.calculate_virality_score(
        video,
        view_history=history,
        collection_dates=collection_dates
    )
    
    print("\nVirality Analysis:")
    print("=" * 50)
    print(f"Overall Virality Score: {result['virality_score']}/100")
    print(f"Level: {get_virality_level(result['virality_score'])}")
    print(f"\nComponent Breakdown:")
    print(f"  Growth Velocity:    {result['growth_velocity']}/100")
    print(f"  Engagement Rate:    {result['engagement_rate']}/100")
    print(f"  Trending Duration:  {result['trending_duration']}/100")
    print(f"  Audience Reach:     {result['audience_reach']}/100")
    print("=" * 50)

