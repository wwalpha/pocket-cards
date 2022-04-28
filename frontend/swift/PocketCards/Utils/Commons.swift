//
//  Commons.swift
//  PocketCards
//
//  Created by macmini on 2022/03/14.
//

import AVFoundation

let Audio = AudioPlayer()

class AudioPlayer {
    var player: AVPlayer?
    var audioPlayer: AVAudioPlayer?

    func play(url: String) {
        guard let thisURL = URL(string: url) else { return }

        let item = AVPlayerItem(url: thisURL)
        player = AVPlayer(playerItem: item)
        player?.volume = 1.0
        player?.play()
    }

    func play(url: URL?) {
        guard let thisURL = url else { return }

        let item = AVPlayerItem(url: thisURL)
        player = AVPlayer(playerItem: item)
        player?.volume = 1.0
        player?.play()
    }

    func playCorrect() {
        playLocal(url: "correct")
    }

    func playInCorrect() {
        playLocal(url: "incorrect")
    }

    private func playLocal(url: String) {
        let path = Bundle.main.path(forResource: url, ofType: "mp3")
        let url = URL(fileURLWithPath: path!)

        do {
            audioPlayer = try AVAudioPlayer(contentsOf: url)
            audioPlayer?.play()
        } catch {}
    }
}
