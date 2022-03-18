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
    
    func play(url: String) {
        guard let thisURL = URL(string: url) else { return }
        
        do {
            let item = AVPlayerItem(url: thisURL)
            player = AVPlayer(playerItem: item)
            player?.volume = 1.0
            player?.play()
        } catch let error as NSError {
            print(error.localizedDescription)
        }
    }
}
