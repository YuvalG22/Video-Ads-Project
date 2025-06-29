package com.example.videoadslibrary;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.media3.common.MediaItem;
import androidx.media3.common.Player;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.ui.PlayerView;

import com.example.videoadslibrary.Interfaces.AdService;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AdPlayerActivity extends AppCompatActivity {

    private PlayerView playerView;
    private ExoPlayer player;
    private boolean adClicked = false;
    private CountDownTimer countDownTimer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ad_player);
        View rootView = findViewById(R.id.root_layout);
        ViewCompat.setOnApplyWindowInsetsListener(rootView, (v, insets) -> {
            Insets systemBarsInsets = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(0, systemBarsInsets.top, 0, systemBarsInsets.bottom);
            return insets;
        });

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {

            }
        });

        TextView countdownTimer = findViewById(R.id.countdown_timer);
        ImageButton closeButton = findViewById(R.id.close_button);
        closeButton.setVisibility(View.GONE);

        String videoUrl = getIntent().getStringExtra("video_url");
        String adTitle = getIntent().getStringExtra("ad_title");
        String adId = getIntent().getStringExtra("ad_id");
        String advertiserUrl = getIntent().getStringExtra("link");
        setTitle(adTitle);

        playerView = findViewById(R.id.player_view);
        player = new ExoPlayer.Builder(this).build();
        playerView.setPlayer(player);
        playerView.setUseController(false);

        MediaItem mediaItem = MediaItem.fromUri(Uri.parse(videoUrl));
        player.setMediaItem(mediaItem);
        player.prepare();
        player.play();

        player.addListener(new Player.Listener() {
            @Override
            public void onPlaybackStateChanged(int state) {
                if (state == Player.STATE_READY) {
                    long durationMs = player.getDuration();
                    if (durationMs > 0) {
                        countDownTimer = new CountDownTimer(durationMs, 1000) {
                            @Override
                            public void onTick(long millisUntilFinished) {
                                int secondsLeft = (int) (millisUntilFinished / 1000);
                                countdownTimer.setText(String.valueOf(secondsLeft));
                            }

                            @Override
                            public void onFinish() {
                                countdownTimer.setVisibility(View.GONE);
                                closeButton.setVisibility(View.VISIBLE);
                                closeButton.setOnClickListener(v -> finish());
                            }
                        };
                        countDownTimer.start();
                    }
                }
            }
        });

        View overlay = findViewById(R.id.overlay_layout);
        overlay.setOnClickListener(v -> {
            adClicked = true;
            VideoAdsSdk.getAdService().incrementClick(adId).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) { }

                @Override
                public void onFailure(Call<Void> call, Throwable t) { }
            });
            player.release();
            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(advertiserUrl));
            startActivity(browserIntent);
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        if(adClicked){
            finish();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (player != null) {
            player.release();
            player = null;
        }
        if (countDownTimer != null) {
            countDownTimer.cancel();
        }
    }
}