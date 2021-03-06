USE [hottrace]
GO
/****** Object:  StoredProcedure [dbo].[p_uw_chatroom_exit]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create proc [dbo].[p_uw_chatroom_exit]
@p_chatroom_no int,
@p_member_no int
as
set nocount on

    DELETE FROM htChatmember
	      WHERE chatroom_no = @p_chatroom_no
		    and member_no = @p_member_no

GO
/****** Object:  StoredProcedure [dbo].[p_uw_chatroom_generate]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[p_uw_chatroom_generate]
@p_member_no int
as
set nocount on

   DECLARE @p_max_no int

   SELECT @p_max_no = MAX(chatroom_no) + 1 FROM htChatroom 
   IF @p_max_no IS NULL SELECT @p_max_no = 1

   INSERT INTO htChatroom   
               (
               chatroom_no,
               chatroom_title,
               update_date,
               register_date,
               usage_flag,
               member_no,
               member_cnt
			   )
		SELECT @p_max_no,
		       '채팅방' + convert(varchar, @p_max_no),
			   getdate(),
               getdate(),
			   '1',
			   @p_member_no,
			   0


	 SELECT @p_max_no as chatroom_no
GO
/****** Object:  StoredProcedure [dbo].[p_uw_chatroom_member_insert]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[p_uw_chatroom_member_insert]
@p_chatroom_no int,
@p_member_no int,
@p_owner_no int
as
set nocount on

    DECLARE @p_count int,
	        @p_member_name varchar(50),
	        @p_chatroom_title varchar(4096)

	SELECT @p_count = count(*) 
	  FROM htChatmember
	 WHERE chatroom_no = @p_chatroom_no
	   and member_no = @p_member_no

	IF @p_count < 1
	BEGIN

	   INSERT INTO htChatmember 
	               (
				   chatroom_no,
				   member_no
				   )
			SELECT @p_chatroom_no,
			       @p_member_no

	END

	SELECT @p_chatroom_title = ''

    DECLARE csr_chatroom_title CURSOR FOR   
    SELECT b.name  
    FROM htChatmember a,
	     htMember b
	WHERE a.chatroom_no = @p_chatroom_no
	  and a.member_no = b.member_no
  
    OPEN csr_chatroom_title  
    FETCH NEXT FROM csr_chatroom_title INTO @p_member_name  
  
    WHILE @@FETCH_STATUS = 0  
    BEGIN  
      
	    IF @p_chatroom_title = '' 
		   SELECT @p_chatroom_title = @p_member_name
		ELSE
           SELECT @p_chatroom_title = @p_chatroom_title + ', ' + @p_member_name

        FETCH NEXT FROM csr_chatroom_title INTO @p_member_name 
		 
    END  
  
    CLOSE csr_chatroom_title  
    DEALLOCATE csr_chatroom_title 

	UPDATE htChatroom
	   SET chatroom_title = @p_chatroom_title
	 WHERE chatroom_no = @p_chatroom_no

	SELECT @p_chatroom_title as chatroom_title
GO
/****** Object:  StoredProcedure [dbo].[p_uw_chatroom_member_read]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[p_uw_chatroom_member_read]
@p_member_no int
as
set nocount on


     SELECT a.*
	   FROM htChatroom a,
	        htChatmember b
	  WHERE a.chatroom_no = b.chatroom_no
	    and b.member_no = @p_member_no
	    and a.usage_flag = '1'
GO
/****** Object:  StoredProcedure [dbo].[p_uw_friend_read]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[p_uw_friend_read]
@p_member_no int,
@p_chatroom_no int
as
set nocount on


     IF @p_chatroom_no < 1
	 BEGIN

     SELECT a.*,
	        b.*,
			'0' as attend_flag
	   FROM htFriend a,
	        htMember b
	  WHERE a.member_no = @p_member_no
	    and a.friend_no = b.member_no

	END
	ELSE
	BEGIN

     SELECT a.name,
	        a.friend_no,
	        c.*,
			CASE WHEN c.member_no IS NULL THEN '0' ELSE '1' END as attend_flag
	   FROM (SELECT a2.name,
	                a1.friend_no
	           FROM htFriend a1,
	                htMember a2
			  WHERE a1.member_no = @p_member_no
			    and a1.friend_no = a2.member_no) a
			LEFT JOIN (SELECT member_no 
			             FROM htChatmember
						WHERE chatroom_no = @p_chatroom_no) c 
			ON c.member_no = a.friend_no
	  ORDER BY a.name
	  
	END

GO
/****** Object:  Table [dbo].[htBoard]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[htBoard](
	[board_id] [int] NULL,
	[board_title] [varchar](100) NULL,
	[board_content] [varchar](max) NULL,
	[board_comment] [varchar](500) NULL,
	[board_like] [int] NULL,
	[board_bad] [int] NULL,
	[board_file] [varchar](max) NULL,
	[board_kind] [varchar](50) NULL,
	[board_age] [int] NULL,
	[board_money] [int] NULL,
	[board_time] [int] NULL,
	[board_people] [int] NULL,
	[board_donut] [int] NULL,
	[board_pie] [int] NULL,
	[city] [varchar](255) NULL,
	[board_writer] [varchar](31) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[htChatmember]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[htChatmember](
	[chatroom_no] [int] NULL,
	[member_no] [int] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[htChatroom]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[htChatroom](
	[chatroom_no] [int] NULL,
	[chatroom_title] [varchar](255) NULL,
	[update_date] [datetime] NULL,
	[register_date] [datetime] NULL,
	[usage_flag] [varchar](100) NULL,
	[member_no] [int] NULL,
	[member_cnt] [int] NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[htCircle]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[htCircle](
	[city] [varchar](50) NOT NULL,
	[donut] [int] NULL,
	[pie] [int] NULL,
	[weight] [int] NULL,
	[c_lon] [float] NULL,
	[c_lat] [float] NULL,
	[evaluation] [varchar](50) NULL,
	[nationality] [varchar](20) NULL,
	[day_or_night] [varchar](20) NULL,
	[neg] [int] NULL,
	[pos] [int] NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[htCLink]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[htCLink](
	[source] [varchar](50) NULL,
	[target] [varchar](50) NULL,
	[weight] [int] NULL,
	[s_donut] [int] NULL,
	[s_pie] [int] NULL,
	[t_donut] [int] NULL,
	[t_pie] [int] NULL,
	[city] [varchar](50) NULL,
	[distance] [varchar](50) NULL,
	[nationality] [varchar](20) NULL,
	[day_or_night] [varchar](20) NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[htData]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[htData](
	[id] [int] NOT NULL,
	[donut] [int] NULL,
	[pie] [int] NULL,
	[age] [float] NULL,
	[people] [int] NULL,
	[money] [int] NULL,
	[time] [int] NULL,
	[city] [varchar](50) NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[htFriend]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[htFriend](
	[member_no] [int] NULL,
	[friend_no] [int] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[htLink]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[htLink](
	[source] [varchar](50) NOT NULL,
	[target] [varchar](50) NOT NULL,
	[weight] [int] NULL,
	[s_lat] [float] NOT NULL,
	[t_lat] [float] NOT NULL,
	[s_lon] [float] NOT NULL,
	[t_lon] [float] NOT NULL,
	[city] [varchar](50) NULL,
	[distance] [float] NOT NULL,
	[nationality] [varchar](20) NULL,
	[day_or_night] [varchar](20) NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[htMember]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[htMember](
	[email] [varchar](50) NOT NULL,
	[password] [varchar](50) NOT NULL,
	[phone] [varchar](50) NOT NULL,
	[country] [varchar](50) NULL,
	[name] [varchar](50) NULL,
	[age] [int] NULL,
	[member_no] [int] NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[test]    Script Date: 2019-05-25 오후 2:20:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[test](
	[test1] [varchar](50) NULL,
	[test2] [int] NULL,
	[test3] [float] NULL
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
