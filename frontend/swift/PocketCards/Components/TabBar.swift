//
//  TabBar.swift
//  PocketCards
//
//  Created by macmini on 2022/03/18.
//

import SwiftUI

class TabBar: UITabBar {
    override func sizeThatFits(_ size: CGSize) -> CGSize {
        super.sizeThatFits(size)
        var sizeThatFits = super.sizeThatFits(size)
        sizeThatFits.height = 180
        return sizeThatFits
    }
}
