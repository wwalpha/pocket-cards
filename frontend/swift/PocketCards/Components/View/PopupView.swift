//
//  PopupView.swift
//  PocketCards
//
//  Created by macmini on 2022/05/05.
//

import SwiftUI

struct PopupView: View {
    @State var isPresented = false

    var body: some View {
        GeometryReader { _ in
            VStack {
                Image(uiImage: UIImage(named: "002.png")!)
                    .onTapGesture {
                        isPresented = true
                    }
                    .fullScreenCover(isPresented: $isPresented) {
                        ImageViewer(isShowing: $isPresented, name: "002.png")
                    }
//                    .overlay(
//                        ImageViewer(isShowing: $isShowing, name: "002.png")
//                            .frame(width: geo.size.width * 0.8, height: geo.size.height * 0.8, alignment: .center)
//                        , alignment: .topTrailing)
            }
        }
    }
}

struct PopupView_Previews: PreviewProvider {
    static var previews: some View {
        PopupView()
            .previewInterfaceOrientation(.landscapeLeft)
    }
}
