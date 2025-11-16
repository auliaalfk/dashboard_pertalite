import pandas as pd
from fastapi import APIRouter 

router = APIRouter(
    tags=["Home Page Data"]
)

def load_engagement_data():
    """
    Memuat dan mempersiapkan data engagement dari CSV asli.
    """
    # 1. Load Data
    try:
        df = pd.read_csv("backend/data/pertalite_tiktok.csv")
    except FileNotFoundError:
        df = pd.read_csv("pertalite_tiktok.csv")
        
    # 2. Cleaning  
    df = df.dropna(subset=['text'])
    df = df.drop_duplicates(subset=['text'])
    
    # 3. Kolom Waktu (WIB)
    df['createTime'] = pd.to_datetime(df['createTimeISO'])
    df['createTime_WIB'] = df['createTime'] + pd.Timedelta(hours=7)
    df['date_WIB'] = df['createTime_WIB'].dt.date
    df['hour_WIB'] = df['createTime_WIB'].dt.hour
    df['day_of_week_WIB'] = df['createTime_WIB'].dt.day_name()
    
    return df

@router.get("/summary")
def get_home_summary():
    """
    Menyediakan SEMUA data yang dibutuhkan untuk Halaman Home
    dalam satu panggilan API.
    """
    df = load_engagement_data()

    # 1. Hitung KPI Cards 
    total_comments = len(df)
    total_likes = int(df['diggCount'].sum())
    total_replies = int(df['replyCommentTotal'].sum())
    avg_engagement = (total_likes / total_comments) if total_comments > 0 else 0

    kpis = {
        "total_comments": total_comments,
        "total_likes": total_likes,
        "total_replies": total_replies,
        "avg_engagement": round(avg_engagement, 2)
    }

    # 2. Data Grafik: Daily Trend
    daily_trend = df.groupby('date_WIB').size().reset_index(name='comments')
    daily_trend['date_WIB'] = daily_trend['date_WIB'].astype(str) 
    
    # 3. Data Grafik: Hourly Pattern
    hourly_pattern = df.groupby('hour_WIB').size().reset_index(name='comments')
    hourly_pattern = hourly_pattern.set_index('hour_WIB').reindex(range(0, 24), fill_value=0).reset_index()

    # 4. Data Grafik: Weekly Pattern
    weekly_pattern = df.groupby('day_of_week_WIB').size()
    days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    weekly_pattern = weekly_pattern.reindex(days_order, fill_value=0).reset_index()
    weekly_pattern.columns = ['day', 'comments']
    
    # 5. Top 5 Most Liked (Tanpa sentimen)
    top_liked = df.sort_values(by='diggCount', ascending=False).head(5)
    top_liked_comments = top_liked[[
        'text', 'uniqueId', 'diggCount', 'replyCommentTotal' 
    ]].to_dict('records')

    # 6. Top 5 Most Replied (Tanpa sentimen)
    top_replied = df.sort_values(by='replyCommentTotal', ascending=False).head(5)
    top_replied_comments = top_replied[[
        'text', 'uniqueId', 'replyCommentTotal', 'diggCount' 
    ]].to_dict('records')

    # 7. Most Influential Accounts
    influential = df.groupby('uniqueId')['diggCount'].sum().sort_values(ascending=False).head(10).reset_index()
    influential.columns = ['username', 'total_likes']
    influential['rank'] = influential.index + 1
    most_influential = influential.to_dict('records')

    response_data = {
        "kpi_cards": kpis,
        "daily_trend_chart": daily_trend.to_dict('records'),
        "hourly_chart": hourly_pattern.to_dict('records'),
        "weekly_chart": weekly_pattern.to_dict('records'),
        "top_liked_comments": top_liked_comments,
        "top_replied_comments": top_replied_comments,
        "most_influential_accounts": most_influential
    }
    
    return response_data