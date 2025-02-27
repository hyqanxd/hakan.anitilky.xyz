import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const DISCORD_ID = process.env.DISCORD_ID
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

const getBadgeUrls = (flags: number) => {
  const badges: { [key: string]: string } = {
    DISCORD_EMPLOYEE: '/badges/discordstaff.svg',
    PARTNERED_SERVER_OWNER: '/badges/discordpartner.svg',
    HYPESQUAD_EVENTS: '/badges/hypesquadevents.svg',
    BUG_HUNTER_LEVEL_1: '/badges/discordbughunter1.svg',
    BUG_HUNTER_LEVEL_2: '/badges/discordbughunter2.svg',
    EARLY_VERIFIED_BOT_DEVELOPER: '/badges/discordbotdev.svg',
    EARLY_SUPPORTER: '/badges/discordearlysupporter.svg',
    ACTIVE_DEVELOPER: '/badges/activedeveloper.svg',
    MODERATOR_PROGRAMS_ALUMNI: '/badges/discordmod.svg',
    
    HOUSE_BRAVERY: '/badges/hypesquadbravery.svg',
    HOUSE_BRILLIANCE: '/badges/hypesquadbrilliance.svg',
    HOUSE_BALANCE: '/badges/hypesquadbalance.svg',
    
    NITRO: '/badges/discordnitro.svg',
    GUILD_BOOST: '/badges/boosts/serverboost.svg',
    
    ORIGINALLY_KNOWN_AS: '/badges/username.png',
    COMPLETED_QUEST: '/badges/quest.png'
  }

  const userBadges: string[] = []
  
  if (flags & (1 << 0)) userBadges.push(badges.DISCORD_EMPLOYEE)
  if (flags & (1 << 1)) userBadges.push(badges.PARTNERED_SERVER_OWNER)
  if (flags & (1 << 2)) userBadges.push(badges.HYPESQUAD_EVENTS)
  if (flags & (1 << 3)) userBadges.push(badges.BUG_HUNTER_LEVEL_1)
  if (flags & (1 << 6)) userBadges.push(badges.HOUSE_BRAVERY)
  if (flags & (1 << 7)) userBadges.push(badges.HOUSE_BRILLIANCE)
  if (flags & (1 << 8)) userBadges.push(badges.HOUSE_BALANCE)
  if (flags & (1 << 9)) userBadges.push(badges.EARLY_SUPPORTER)
  if (flags & (1 << 14)) userBadges.push(badges.BUG_HUNTER_LEVEL_2)
  if (flags & (1 << 17)) userBadges.push(badges.EARLY_VERIFIED_BOT_DEVELOPER)
  if (flags & (1 << 18)) userBadges.push(badges.MODERATOR_PROGRAMS_ALUMNI)
  if (flags & (1 << 22)) userBadges.push(badges.ACTIVE_DEVELOPER)

  return userBadges
}

export async function GET() {
  try {
    const userResponse = await fetch(`https://discord.com/api/v10/users/${DISCORD_ID}?with_profile=true`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`
      }
    })
    
    const userData = await userResponse.json()
    
    if (!userResponse.ok) {
      return NextResponse.json({
        status: 'offline',
      })
    }

    const guildId = process.env.DISCORD_GUILD_ID
    const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${DISCORD_ID}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    const memberData = await memberResponse.json()

    const lanyardResponse = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
    let presenceData = { status: 'offline', activities: [] }
    
    if (lanyardResponse.ok) {
      const lanyardData = await lanyardResponse.json()
      
      if (lanyardData.success) {
        presenceData = {
          status: lanyardData.data.discord_status || 'offline',
          activities: lanyardData.data.activities || []
        }

        if (lanyardData.data.listening_to_spotify && lanyardData.data.spotify) {
          const spotifyData = lanyardData.data.spotify;
          const spotifyActivity = {
            type: 2,
            name: 'Spotify',
            details: spotifyData.song,
            state: `by ${spotifyData.artist}`,
            assets: {
              large_image: `spotify:${spotifyData.album_art_id}`,
              large_text: spotifyData.album,
              small_image: 'spotify:spotify-logo',
              small_text: 'Spotify'
            },
            timestamps: {
              start: new Date(spotifyData.timestamps.start).getTime(),
              end: new Date(spotifyData.timestamps.end).getTime()
            },
            sync_id: spotifyData.track_id,
            created_at: Date.now()
          };

          presenceData.activities.unshift(spotifyActivity);
        }
      }
    }

    const avatar = userData.avatar
      ? `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${userData.avatar}.png?size=256`
      : null

    const banner = userData.banner
      ? `https://cdn.discordapp.com/banners/${DISCORD_ID}/${userData.banner}.png?size=600`
      : null

    const decoration = userData.avatar_decoration_data?.asset
      ? `https://cdn.discordapp.com/avatar-decoration-presets/${userData.avatar_decoration_data.asset}.png?size=96&passthrough=true`
      : memberData.avatar_decoration_data?.asset
      ? `https://cdn.discordapp.com/avatar-decoration-presets/${memberData.avatar_decoration_data.asset}.png?size=96&passthrough=true`
      : null;

    const theme_colors = userData.theme_colors || []

    const badges = getBadgeUrls(userData.public_flags || 0)

    const premiumType = memberData.premium_since ? 2 : undefined
    if (premiumType) {
      badges.push('/badges/discordnitro.svg')
    }

    if (memberData.premium_since) {
      const boostStartDate = new Date(memberData.premium_since);
      const now = new Date();
      const monthsDiff = (now.getFullYear() - boostStartDate.getFullYear()) * 12 + now.getMonth() - boostStartDate.getMonth();

      let boostLevel;
      if (monthsDiff >= 24) {
        boostLevel = 9;
      } else if (monthsDiff >= 21) {
        boostLevel = 8;
      } else if (monthsDiff >= 18) {
        boostLevel = 7;
      } else if (monthsDiff >= 15) {
        boostLevel = 6;
      } else if (monthsDiff >= 12) {
        boostLevel = 5;
      } else if (monthsDiff >= 9) {
        boostLevel = 4;
      } else if (monthsDiff >= 6) {
        boostLevel = 3;
      } else if (monthsDiff >= 3) {
        boostLevel = 2;
      } else if (monthsDiff >= 2) {
        boostLevel = 1;
      } else {
        boostLevel = 1;
      }

      badges.push(`/badges/boosts/discordboost${boostLevel}.svg`);
    }

    if (userData.global_name && userData.username !== userData.global_name) {
      badges.push('/badges/username.png')
    }

    const activities = presenceData?.activities || [];
    let processedActivity = null;
    let customStatus = null;

    const activityTypes = {
      0: 'PLAYING',
      1: 'STREAMING',
      2: 'LISTENING',
      3: 'WATCHING',
      4: 'CUSTOM',
      5: 'COMPETING'
    };

    const customStatusActivity = activities.find(activity => activity.type === 4);
    if (customStatusActivity) {
      customStatus = {
        state: customStatusActivity.state || null,
        emoji: customStatusActivity.emoji ? {
          name: customStatusActivity.emoji.name,
          id: customStatusActivity.emoji.id,
          animated: customStatusActivity.emoji.animated,
          url: customStatusActivity.emoji.id 
            ? `https://cdn.discordapp.com/emojis/${customStatusActivity.emoji.id}.${customStatusActivity.emoji.animated ? 'gif' : 'png'}`
            : null
        } : null
      };
    }

    const otherActivities = activities.filter(activity => activity.type !== 4);
    
    const priorityOrder = {
      STREAMING: 1,
      SPOTIFY: 2,
      PLAYING: 3,
      LISTENING: 4,
      WATCHING: 5,
      COMPETING: 6
    };

    const sortedActivities = otherActivities.sort((a, b) => {
      const getType = (activity) => {
        if (activity.type === 2 && activity.name === 'Spotify') return 'SPOTIFY';
        return activityTypes[activity.type] || 'PLAYING';
      };

      const typeA = getType(a);
      const typeB = getType(b);

      return (priorityOrder[typeA] || 99) - (priorityOrder[typeB] || 99);
    });

    if (sortedActivities.length > 0) {
      const activity = sortedActivities[0];
      const activityType = activity.type === 2 && activity.name === 'Spotify' 
        ? 'SPOTIFY' 
        : activityTypes[activity.type] || 'PLAYING';

      processedActivity = {
        type: activityType,
        name: activity.name || null,
        details: activity.details || null,
        state: activity.state || null,
        timestamps: activity.timestamps || null,
        application_id: activity.application_id || null,
        assets: activity.assets ? {
          large_image: activity.assets.large_image ? 
            activity.assets.large_image.startsWith('mp:')
              ? `https://media.discordapp.net/${activity.assets.large_image.slice(3)}`
              : activity.assets.large_image.startsWith('spotify:')
              ? `https://i.scdn.co/image/${activity.assets.large_image.slice(8)}`
              : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
            : null,
          large_text: activity.assets.large_text || null,
          small_image: activity.assets.small_image ?
            activity.assets.small_image.startsWith('mp:')
              ? `https://media.discordapp.net/${activity.assets.small_image.slice(3)}`
              : activity.assets.small_image.startsWith('spotify:')
              ? `https://i.scdn.co/image/${activity.assets.small_image.slice(8)}`
              : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`
            : null,
          small_text: activity.assets.small_text || null
        } : null,
        buttons: activity.buttons || [],
        url: activity.url || null,
        created_at: activity.created_at || Date.now(),
        flags: activity.flags || 0,
        party: activity.party || null,
        sync_id: activity.sync_id || null,
        session_id: activity.session_id || null,
        platform: activity.platform || null
      }

      if (activityType === 'SPOTIFY' && activity.sync_id) {
        processedActivity.url = `https://open.spotify.com/track/${activity.sync_id}`;
      }
    }

    return NextResponse.json({
      status: presenceData?.status || 'offline',
      custom_status: customStatus,
      activity: processedActivity,
      avatar,
      banner,
      decoration,
      theme_colors,
      badges,
      username: userData.username,
      global_name: userData.global_name,
      discriminator: userData.discriminator,
      accent_color: userData.accent_color,
      premium_type: premiumType
    })
  } catch (error) {
    console.error('Discord API Error:', error)
    return NextResponse.json({
      status: 'offline',
    })
  }
} 