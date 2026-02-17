def get_notification_email_html(title, content_type, url):
    return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #012340 0%, #0477BF 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Inno8 Solutions</h1>
                            <p style="color: #FCB316; margin: 10px 0 0 0; font-size: 14px;">Software House & Marketing Agency</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="40" style="vertical-align: top;">
                                        <div style="width: 32px; height: 32px; background-color: #FCB316; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">🎉</div>
                                    </td>
                                    <td style="vertical-align: top;">
                                        <h2 style="color: #012340; margin: 0 0 20px 0; font-size: 20px;">New {content_type.title()} Published!</h2>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                                Hi there,
                            </p>
                            <p style="color: #666666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                                We just published a new {content_type} that you might find interesting:
                            </p>
                            
                            <!-- Content Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-left: 4px solid #0477BF; border-radius: 4px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="color: #012340; margin: 0 0 15px 0; font-size: 20px;">{title}</h3>
                                        <a href="{url}" style="display: inline-block; background-color: #0477BF; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold; font-size: 16px;">Read Now →</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; line-height: 1.6; margin: 0; font-size: 16px;">
                                Best regards,<br>
                                <strong style="color: #012340;">Inno8 Solutions Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                            <p style="color: #999999; margin: 0 0 10px 0; font-size: 14px;">
                                You're receiving this email because you subscribed to our newsletter.
                            </p>
                            <p style="color: #999999; margin: 0; font-size: 12px;">
                                <a href="{url.split('/')[0]}//{url.split('/')[2]}/unsubscribe" style="color: #0477BF; text-decoration: none;">Unsubscribe</a> | 
                                <a href="{url.split('/')[0]}//{url.split('/')[2]}" style="color: #0477BF; text-decoration: none;">Visit Website</a>
                            </p>
                            <p style="color: #cccccc; margin: 15px 0 0 0; font-size: 12px;">
                                © 2024 Inno8 Solutions. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""

def get_welcome_email_html():
    return """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #012340 0%, #0477BF 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Welcome to Inno8!</h1>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 10px;">
                                <tr>
                                    <td align="center">
                                        <span style="color: #FCB316; font-size: 20px; vertical-align: middle; margin-right: 5px;">✨</span>
                                        <span style="color: #FCB316; font-size: 16px; vertical-align: middle;">Thank you for subscribing</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="40" style="vertical-align: top;">
                                        <div style="width: 32px; height: 32px; background-color: #FCB316; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">🎉</div>
                                    </td>
                                    <td style="vertical-align: top;">
                                        <h2 style="color: #012340; margin: 0 0 20px 0; font-size: 24px;">You're All Set!</h2>
                                    </td>
                                </tr>
                            </table>
                            <p style="color: #666666; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                                Thank you for subscribing to the Inno8 Solutions newsletter!
                            </p>
                            <p style="color: #666666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
                                You'll now receive updates about:
                            </p>
                            
                            <!-- Features List -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 15px; background-color: #f8f9fa; border-radius: 4px; margin-bottom: 10px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="40" style="vertical-align: top;">
                                                    <div style="width: 32px; height: 32px; background-color: #0477BF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">📝</div>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <p style="margin: 0; color: #012340; font-size: 16px;"><strong>Latest Blog Posts</strong></p>
                                                    <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Tech insights and industry trends</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr><td style="height: 10px;"></td></tr>
                                <tr>
                                    <td style="padding: 15px; background-color: #f8f9fa; border-radius: 4px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="40" style="vertical-align: top;">
                                                    <div style="width: 32px; height: 32px; background-color: #0477BF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">💼</div>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <p style="margin: 0; color: #012340; font-size: 16px;"><strong>New Projects</strong></p>
                                                    <p style="margin: 5px 0 0 0; color: #666666; font-size: 14px;">Our latest work and case studies</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; line-height: 1.6; margin: 0; font-size: 16px;">
                                Best regards,<br>
                                <strong style="color: #012340;">Inno8 Solutions Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                            <p style="color: #999999; margin: 0 0 10px 0; font-size: 14px;">
                                Questions? Contact us at info.inno8sh@gmail.com
                            </p>
                            <p style="color: #cccccc; margin: 15px 0 0 0; font-size: 12px;">
                                © 2026 Inno8 Solutions. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""
