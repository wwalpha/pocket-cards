//
//  ImageView.swift
//  PocketCards
//
//  Created by macmini on 2022/05/05.
//

import SwiftUI
import UIKit

struct ImageViewer: View {
    @Binding var isShowing: Bool
    var name: String = ""

    var body: some View {
        VStack {
            if isShowing {
                Image(uiImage: FileManager.default.loadImage(fileName: name)!)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .onTapGesture {
                        isShowing = false
                    }
            } else {
                Text("")
            }
        }
        .padding()
        .background(Color.black)
    }
}

struct ImageViewer_Previews: PreviewProvider {
    @State static var isShowing = true

    static var previews: some View {
        ImageViewer(isShowing: $isShowing, name: "002.png")
            .previewInterfaceOrientation(.landscapeLeft)
    }
}
